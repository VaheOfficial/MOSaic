from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import select
import numpy as np
from app.core.db import get_db
from app.core.scoring import score_candidate
from app.core.optimize import optimize
from app.models.base import Role, RoleRequirement, SurveyMember
from app.core.skills import normalize_skills

router = APIRouter()

@router.post("/run")
def run_match(unit: str = Query(...), top_k: int = 3, db: Session = Depends(get_db)):
    # Fetch roles for unit
    roles = db.execute(select(Role).where(Role.unit==unit)).scalars().all()
    role_reqs = {r.id: db.execute(select(RoleRequirement).where(RoleRequirement.role_id==r.id)).scalars().all() for r in roles}
    role_features = []
    role_ids = []
    for r in roles:
        skills = [req.skill for req in role_reqs[r.id]]
        role_features.append({"skills": skills})
        role_ids.append(r.id)

    # Candidates from member surveys (mock person pool)
    members = db.execute(select(SurveyMember)).scalars().all()
    person_features = []
    for m in members:
        ft = m.data.get("free_text","")
        skills = m.data.get("skills") or normalize_skills(ft)
        pf = {
            "skills": skills,
            "relevant_years": m.data.get("relevant_years", 0),
            "training_ready": float(m.data.get("training_ready", 0))/100.0,
            "interested": True if m.data.get("interested_roles") else False
        }
        person_features.append(pf)

    P, R = len(person_features), len(role_features)
    scores = np.zeros((P, R), dtype=float)
    for i in range(P):
        for j in range(R):
            scores[i, j] = score_candidate(person_features[i], role_features[j])

    pairs = optimize(scores)
    # Build top-k per role
    results = {rid: [] for rid in role_ids}
    for j in range(R):
        ranking = sorted([(i, scores[i, j]) for i in range(P)], key=lambda x: x[1], reverse=True)[:top_k]
        results[role_ids[j]] = [{"member_index": i, "score": float(s)} for i, s in ranking]

    assignment = [{"person_index": int(i), "role_id": int(role_ids[j]), "score": float(scores[i,j])} for i,j in pairs]
    return {"assignment": assignment, "rankings": results}
