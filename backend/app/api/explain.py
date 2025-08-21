from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ExplainRequest(BaseModel):
    person_name: str
    role_title: str
    matched_skills: list[str] = []
    gaps: list[str] = []


@router.post("/explain")
def explain_match(payload: ExplainRequest):
    # POC stub; in production call OpenAI and craft rationale
    if payload.matched_skills:
        skill_part = f"matches on {', '.join(payload.matched_skills)}"
    else:
        skill_part = "has relevant background"
    if payload.gaps:
        gap_part = f"; training can address: {', '.join(payload.gaps)}"
    else:
        gap_part = ""
    text = f"{payload.person_name} is a good fit for {payload.role_title}: {skill_part}{gap_part}."
    return {"text": text}


