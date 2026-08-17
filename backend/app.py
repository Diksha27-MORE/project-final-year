from flask import Flask, request, jsonify, send_from_directory
import sys
import webbrowser
import threading
import time
from pathlib import Path
import networkx as nx

# ---------------- PATH SETUP ----------------

backend_dir = Path(__file__).parent

if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from engine.risk_engine import RiskEngine
from services.job_recommender import get_safe_jobs
from services.skill_analyzer import analyze_skill_gap

# ---------------- APP INIT ----------------

FRONTEND_PATH = Path(__file__).parent.parent / "frontend"

app = Flask(
    __name__,
    static_folder=str(FRONTEND_PATH),
    static_url_path=""
)

risk_engine = RiskEngine()

# ---------------- GRAPH INIT ----------------

G = nx.Graph()

def update_graph(user, internship, company, risk_level):

    G.add_node(user, type="student")

    G.add_node(
        internship,
        type="internship",
        risk=risk_level
    )

    G.add_node(company, type="company")

    G.add_edge(
        user,
        internship,
        relation="checked"
    )

    G.add_edge(
        internship,
        company,
        relation="belongs_to"
    )

# =========================================================
# FRONTEND ROUTES
# =========================================================

# MAIN WEBSITE / LOGIN PAGE

@app.route("/")
def home():
    return send_from_directory(FRONTEND_PATH, "index.html")


# DASHBOARD PAGE

@app.route("/dashboard")
def dashboard():
    return send_from_directory(FRONTEND_PATH, "dashboard.html")


# SERVE CSS / JS / IMAGES / OTHER FILES

@app.route("/assets/<path:filename>")
def assets(filename):
    return send_from_directory(
        FRONTEND_PATH / "assets",
        filename
    )


# =========================================================
# HEALTH CHECK
# =========================================================

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "status": "healthy",
        "service": "InternTrust Backend"
    }), 200


# =========================================================
# FRAUD ANALYSIS
# =========================================================

@app.route("/analyze", methods=["POST"])
def analyze():

    try:

        data = request.get_json() or {}

        required = [
            "title",
            "description",
            "email",
            "website"
        ]

        missing = [
            field for field in required
            if not data.get(field)
        ]

        if missing:

            return jsonify({
                "success": False,
                "error": f"Missing fields: {missing}"
            }), 400

        # ---------------- RISK ANALYSIS ----------------

        result = risk_engine.analyze(
            title=data.get("title", ""),
            description=data.get("description", ""),
            email=data.get("email", ""),
            website=data.get("website", ""),
            company_name=data.get("company_name", "")
        )

        # ---------------- SKILL ANALYSIS ----------------

        user_skills = data.get("skills", [])

        if isinstance(user_skills, str):

            user_skills = [
                s.strip()
                for s in user_skills.split(",")
            ]

        skill_result = analyze_skill_gap(user_skills)

        # ---------------- GRAPH UPDATE ----------------

        user = data.get(
            "user",
            "anonymous_user"
        )

        internship_id = data.get(
            "title",
            ""
        )[:30]

        company = data.get(
            "company_name",
            "unknown_company"
        )

        risk_level = result.get(
            "risk_level",
            "unknown"
        )

        update_graph(
            user,
            internship_id,
            company,
            risk_level
        )

        return jsonify({
            "success": True,
            "data": result,
            "skill_gap": skill_result
        }), 200

    except Exception as e:

        print("❌ Analyze Error:", e)

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# =========================================================
# GRAPH API
# =========================================================

@app.route("/api/graph", methods=["GET"])
def get_graph():

    try:

        data = nx.readwrite.json_graph.node_link_data(G)

        return jsonify({
            "success": True,
            "graph": data
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        })


# =========================================================
# JOB RECOMMENDATION
# =========================================================

@app.route("/api/recommend", methods=["POST"])
def recommend():

    try:

        data = request.get_json() or {}

        if not isinstance(
            data.get("interests", []),
            list
        ):
            data["interests"] = []

        jobs = get_safe_jobs(data)

        if not jobs:

            jobs = [{
                "title": "Try Different Skills",
                "location": "Remote",
                "type": "N/A",
                "match": 50,
                "link": "#"
            }]

        return jsonify({
            "success": True,
            "jobs": jobs
        }), 200

    except Exception as e:

        print("❌ Recommendation Error:", e)

        return jsonify({
            "success": False,
            "jobs": [],
            "error": str(e)
        }), 500


# =========================================================
# SKILL ANALYZER
# =========================================================

@app.route("/api/skill-gap", methods=["POST"])
def skill_gap():

    try:

        data = request.get_json() or {}

        skills = data.get("skills", [])

        if isinstance(skills, str):

            skills = [
                s.strip()
                for s in skills.split(",")
            ]

        result = analyze_skill_gap(skills)

        return jsonify({
            "success": True,
            "data": result
        }), 200

    except Exception as e:

        print("❌ Skill Gap Error:", e)

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# =========================================================
# CORS
# =========================================================

@app.after_request
def after_request(response):

    response.headers[
        "Access-Control-Allow-Origin"
    ] = "*"

    response.headers[
        "Access-Control-Allow-Methods"
    ] = "GET, POST, PUT, DELETE, OPTIONS"

    response.headers[
        "Access-Control-Allow-Headers"
    ] = "Content-Type, Authorization"

    return response


# =========================================================
# RUN APP
# =========================================================

if __name__ == "__main__":

    print("=" * 50)
    print("🚀 InternTrust Running")
    print("=" * 50)
    print("Main Website : http://localhost:5000")
    print("Dashboard    : http://localhost:5000/dashboard")
    print("Graph API    : http://localhost:5000/api/graph")
    print("=" * 50)

    def open_in_chrome(url: str):
        chrome_paths = [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        ]

        for path in chrome_paths:
            if Path(path).exists():
                webbrowser.register(
                    "chrome",
                    None,
                    webbrowser.BackgroundBrowser(path)
                )
                try:
                    webbrowser.get("chrome").open_new_tab(url)
                    return
                except webbrowser.Error:
                    break

        try:
            webbrowser.get("chrome").open_new_tab(url)
        except webbrowser.Error:
            webbrowser.open_new_tab(url)

    browser_thread = threading.Thread(
        target=lambda: (time.sleep(1), open_in_chrome("http://localhost:5000")),
        daemon=True
    )
    browser_thread.start()

    app.run(
        debug=True,
        use_reloader=False,
        host="0.0.0.0",
        port=5000
    )