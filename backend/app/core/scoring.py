from typing import Dict, List
import numpy as np

def jaccard(a: List[str], b: List[str]) -> float:
    sa, sb = set(a), set(b)
    if not sa and not sb:
        return 0.0
    return len(sa & sb) / len(sa | sb)

def score_candidate(person_features: Dict, role_requirements: Dict) -> float:
    # Very simple POC scoring
    skill_sim = jaccard(person_features.get("skills", []), role_requirements.get("skills", []))
    exp = person_features.get("relevant_years", 0) / 10.0  # normalize 0..1
    training = person_features.get("training_ready", 0.0)
    interest = 1.0 if person_features.get("interested", False) else 0.0
    return 0.5*skill_sim + 0.2*exp + 0.2*training + 0.1*interest
