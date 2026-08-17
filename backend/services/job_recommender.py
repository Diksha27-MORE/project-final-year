import requests

def get_safe_jobs(user_input):
    skills_input = user_input.get("interests", [])
    location_input = user_input.get("location", "").lower()

    query = " ".join(skills_input) if skills_input else "developer"

    try:
        url = f"https://remotive.com/api/remote-jobs?search={query}"
        response = requests.get(url)
        data = response.json()

        jobs_data = data.get("jobs", [])

        results = []

        for job in jobs_data:
            title = job.get("title", "")
            location = job.get("candidate_required_location", "").lower()
            company = job.get("company_name", "")
            link = job.get("url", "")

            if not title or not link:
                continue

            match = 60

            # 🎯 PRIORITY SYSTEM
            if location_input and location_input in location:
                match += 30
            elif "india" in location:
                match += 25
            elif "asia" in location:
                match += 15
            else:
                match += 5   # fallback instead of removing

            results.append({
                "title": f"{title} at {company}",
                "location": location.title() if location else "Remote",
                "type": "Remote",
                "match": min(match, 100),
                "link": link
            })

        # 🔥 SORT BY BEST MATCH
        results = sorted(results, key=lambda x: x["match"], reverse=True)

        return results[:5] if results else [{
            "title": "No jobs found",
            "location": "Try different keywords",
            "type": "N/A",
            "match": 0,
            "link": "#"
        }]

    except Exception as e:
        print("API Error:", e)

        return [{
            "title": "Error fetching jobs",
            "location": "Check internet/API",
            "type": "N/A",
            "match": 0,
            "link": "#"
        }]