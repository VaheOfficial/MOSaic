import json, pathlib

def load_courses() -> list:
    p = pathlib.Path(__file__).resolve().parent.parent / "data" / "courses.json"
    with open(p, "r") as f:
        return json.load(f)
