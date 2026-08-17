import pandas as pd
from collections import Counter
import os

def analyze_skill_gap(user_skills):

    # CSV FILE PATH
    csv_path = "data/Fake_Real_Job_Posting.csv"

    # DEBUG
    print("CSV PATH:", csv_path)
    print("FILE EXISTS:", os.path.exists(csv_path))

    # LOAD CSV
    df = pd.read_csv(csv_path)

    # SHOW COLUMN NAMES
    print("CSV COLUMNS:", df.columns)

    # CHECK DESCRIPTION COLUMN
    if "description" not in df.columns:
        return {
            "error": "description column not found",
            "available_columns": list(df.columns)
        }

    words = []

    # EXTRACT WORDS
    for desc in df["description"].dropna():

        # SAFE STRING CONVERSION
        desc = str(desc).lower()

        # SPLIT WORDS
        words.extend(desc.split())

    # MOST COMMON WORDS
    common = [w for w, _ in Counter(words).most_common(50)]

    # CLEAN USER SKILLS
    user_skills = [
        str(skill).lower().strip()
        for skill in user_skills
    ]

    # FIND MISSING SKILLS
    missing = [
        skill for skill in common
        if skill not in user_skills
    ]

    return {
        "your_skills": user_skills,
        "missing_skills": missing[:10]
    }