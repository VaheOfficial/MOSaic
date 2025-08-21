from typing import List, Set

# Minimal skill normalization for POC
CANONICAL_SKILLS = {
    "red teaming": {"red team", "adversary emulation"},
    "blue teaming": {"defensive ops", "soc"},
    "recon": {"osint", "reconnaissance"},
    "web exploitation": {"web app", "xss", "sqli"},
    "reverse engineering": {"re", "rev eng"},
    "threat hunting": {"hunt"},
    "space ops": {"satcom", "ttc"},
    "networking": {"netops", "routing", "switching"},
    "python": {"py"},
    "linux": {"unix"},
}

def normalize_skills(free_text: str) -> List[str]:
    ft = free_text.lower()
    found = set()
    for canon, aliases in CANONICAL_SKILLS.items():
        if canon in ft or any(a in ft for a in aliases):
            found.add(canon)
    return sorted(found)
