from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.parse_surf import parse_surf_html
from app.core.schema import SURF, MemberSurvey, SupervisorSurvey
from app.models.base import SurveyMember, SurveySupervisor

router = APIRouter()

@router.post("/surf", response_model=SURF)
async def ingest_surf(file: UploadFile = File(...)):
    html = (await file.read()).decode(errors="ignore")
    data = parse_surf_html(html)
    return SURF(**data)

@router.post("/member")
def member_survey(payload: MemberSurvey, db: Session = Depends(get_db)):
    rec = SurveyMember(person_id=payload.person_id, data=payload.data)
    db.add(rec); db.commit(); db.refresh(rec)
    return {"id": rec.id}

@router.post("/supervisor")
def supervisor_survey(payload: SupervisorSurvey, db: Session = Depends(get_db)):
    rec = SurveySupervisor(role_id=payload.role_id, data=payload.data)
    db.add(rec); db.commit(); db.refresh(rec)
    return {"id": rec.id}

# Aliases to match POC contract
@router.post("/member-survey")
def member_survey_alias(payload: MemberSurvey, db: Session = Depends(get_db)):
    rec = SurveyMember(person_id=payload.person_id, data=payload.data)
    db.add(rec); db.commit(); db.refresh(rec)
    return {"id": rec.id}

@router.post("/supervisor-survey")
def supervisor_survey_alias(payload: SupervisorSurvey, db: Session = Depends(get_db)):
    rec = SurveySupervisor(role_id=payload.role_id, data=payload.data)
    db.add(rec); db.commit(); db.refresh(rec)
    return {"id": rec.id}
