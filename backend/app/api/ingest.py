from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.parse_surf import parse_surf_html
from app.core.schema import SURF, MemberSurvey, SupervisorSurvey, MemberProfile, SupervisorEvaluation
from app.models.base import SurveyMember, SurveySupervisor
from app.core.auth import require_roles

router = APIRouter()

@router.post("/surf", response_model=SURF)
async def ingest_surf(file: UploadFile = File(...)):
    html = (await file.read()).decode(errors="ignore")
    data = parse_surf_html(html)
    return SURF(**data)

@router.post("/member", dependencies=[Depends(require_roles("member", "supervisor", "commander"))])
def member_survey(payload: MemberSurvey, db: Session = Depends(get_db)):
    rec = SurveyMember(person_id=payload.person_id, data=payload.data)
    db.add(rec); db.commit(); db.refresh(rec)
    return {"id": rec.id}

@router.post("/supervisor", dependencies=[Depends(require_roles("supervisor", "commander"))])
def supervisor_survey(payload: SupervisorSurvey, db: Session = Depends(get_db)):
    rec = SurveySupervisor(role_id=payload.role_id, data=payload.data)
    db.add(rec); db.commit(); db.refresh(rec)
    return {"id": rec.id}

# Aliases to match POC contract
@router.post("/member-survey", dependencies=[Depends(require_roles("member", "supervisor", "commander"))])
def member_survey_alias(payload: MemberSurvey, db: Session = Depends(get_db)):
    rec = SurveyMember(person_id=payload.person_id, data=payload.data)
    db.add(rec); db.commit(); db.refresh(rec)
    return {"id": rec.id}

@router.post("/supervisor-survey", dependencies=[Depends(require_roles("supervisor", "commander"))])
def supervisor_survey_alias(payload: SupervisorSurvey, db: Session = Depends(get_db)):
    rec = SurveySupervisor(role_id=payload.role_id, data=payload.data)
    db.add(rec); db.commit(); db.refresh(rec)
    return {"id": rec.id}

# New structured endpoints
@router.post("/member/profile", dependencies=[Depends(require_roles("member", "supervisor", "commander"))])
def create_member_profile(payload: MemberProfile, db: Session = Depends(get_db)):
    """Create a structured member profile"""
    # Convert structured data to the legacy format for storage
    data = {
        "identity": {
            "full_name": payload.personal_info.full_name,
            "grade": payload.personal_info.rank,
            "unit": payload.personal_info.unit,
            "duty_title": payload.personal_info.duty_position,
        },
        "primary_skills": payload.skills_experience.primary_skills,
        "secondary_skills": payload.skills_experience.specialty_areas,
        "tools": payload.skills_experience.tools,
        "certifications": payload.skills_experience.certifications,
        "years_service": payload.personal_info.years_service,
        "clearance_level": payload.personal_info.clearance_level,
        "experience_summary": payload.skills_experience.experience_summary,
        "career_goals": payload.career_preferences.career_goals,
        "interested_roles": payload.career_preferences.preferred_roles,
        "avoid_roles": payload.career_preferences.avoid_roles,
        "willing_pcs": payload.career_preferences.willing_to_relocate,
        "deployment_availability": payload.career_preferences.deployment_availability,
        "language_skills": payload.additional_info.language_skills,
        "additional_info": payload.additional_info.additional_information,
        "consent": True,  # Implied by submission
        "skills": list(set(payload.skills_experience.primary_skills + payload.skills_experience.specialty_areas))
    }
    
    rec = SurveyMember(person_id=None, data=data)
    db.add(rec); db.commit(); db.refresh(rec)
    return {"id": rec.id, "message": "Member profile created successfully"}

@router.post("/supervisor/evaluation", dependencies=[Depends(require_roles("supervisor", "commander"))])
def create_supervisor_evaluation(payload: SupervisorEvaluation, db: Session = Depends(get_db)):
    """Create a structured supervisor evaluation"""
    # Convert structured data to the legacy format for storage
    data = {
        "member_info": {
            "name": payload.member_info.name,
            "rank": payload.member_info.rank,
            "unit": payload.member_info.unit,
        },
        "evaluation_info": {
            "period": payload.evaluation_info.period,
            "supervisor_name": payload.evaluation_info.supervisor_name,
            "relationship_duration": payload.evaluation_info.relationship_duration,
        },
        "performance_ratings": payload.performance_ratings.dict(),
        "qualitative_assessment": payload.qualitative_assessment.dict(),
        "career_development": payload.career_development.dict(),
        "overall_score": (
            payload.performance_ratings.technical_competence +
            payload.performance_ratings.leadership_ability +
            payload.performance_ratings.communication +
            payload.performance_ratings.reliability +
            payload.performance_ratings.adaptability +
            payload.performance_ratings.initiative +
            payload.performance_ratings.teamwork +
            payload.performance_ratings.professional_development
        ) / 8.0
    }
    
    rec = SurveySupervisor(role_id=None, data=data)
    db.add(rec); db.commit(); db.refresh(rec)
    return {"id": rec.id, "message": "Evaluation submitted successfully"}

# Additional endpoints for improved flow
@router.get("/member/profile", dependencies=[Depends(require_roles("member", "supervisor", "commander"))])
def get_member_profile(db: Session = Depends(get_db)):
    """Get the current user's member profile"""
    # For now, return the latest profile (in real app, filter by user_id)
    rec = db.query(SurveyMember).order_by(SurveyMember.id.desc()).first()
    if rec:
        return {"id": rec.id, "data": rec.data}
    else:
        raise HTTPException(status_code=404, detail="Profile not found")

@router.put("/member/profile/{profile_id}", dependencies=[Depends(require_roles("member", "supervisor", "commander"))])
def update_member_profile(profile_id: int, payload: MemberProfile, db: Session = Depends(get_db)):
    """Update an existing member profile"""
    rec = db.query(SurveyMember).filter(SurveyMember.id == profile_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Convert structured data to the legacy format for storage
    data = {
        "identity": {
            "full_name": payload.personal_info.full_name,
            "grade": payload.personal_info.rank,
            "unit": payload.personal_info.unit,
            "duty_title": payload.personal_info.duty_position,
        },
        "primary_skills": payload.skills_experience.primary_skills,
        "secondary_skills": payload.skills_experience.specialty_areas,
        "tools": payload.skills_experience.tools,
        "certifications": payload.skills_experience.certifications,
        "years_service": payload.personal_info.years_service,
        "clearance_level": payload.personal_info.clearance_level,
        "experience_summary": payload.skills_experience.experience_summary,
        "career_goals": payload.career_preferences.career_goals,
        "interested_roles": payload.career_preferences.preferred_roles,
        "avoid_roles": payload.career_preferences.avoid_roles,
        "willing_pcs": payload.career_preferences.willing_to_relocate,
        "deployment_availability": payload.career_preferences.deployment_availability,
        "language_skills": payload.additional_info.language_skills,
        "additional_info": payload.additional_info.additional_information,
        "consent": True,
        "skills": list(set(payload.skills_experience.primary_skills + payload.skills_experience.specialty_areas))
    }
    
    rec.data = data
    db.commit(); db.refresh(rec)
    return {"id": rec.id, "message": "Profile updated successfully"}

@router.get("/members/list", dependencies=[Depends(require_roles("supervisor", "commander"))])
def get_members_list(db: Session = Depends(get_db)):
    """Get list of members for supervisor evaluation"""
    members = db.query(SurveyMember).all()
    result = []
    for member in members:
        identity = member.data.get('identity', {})
        result.append({
            "id": member.id,
            "name": identity.get('full_name', 'Unknown'),
            "rank": identity.get('grade', 'Unknown'),
            "unit": identity.get('unit', 'Unknown')
        })
    return result
