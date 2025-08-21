from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.db import get_db
from app.core.schema import RoleIn, Course
from app.models.base import Role, RoleRequirement
from app.core.training import load_courses
from app.core.auth import require_roles

router = APIRouter()

@router.get("/courses", response_model=list[Course])
def get_courses():
    return load_courses()

# Alias for training catalog per POC
@router.get("/training", response_model=list[Course])
def get_training_catalog():
    return load_courses()

@router.post("/roles", dependencies=[Depends(require_roles("supervisor", "commander"))])
def create_role(role: RoleIn, db: Session = Depends(get_db)):
    r = Role(
        unit=role.unit, title=role.title, min_grade=role.min_grade,
        clearance_req=role.clearance_req, relocation_allowed=role.relocation_allowed, notes=role.notes
    )
    db.add(r); db.commit(); db.refresh(r)
    for req in role.requirements:
        db.add(RoleRequirement(role_id=r.id, skill=req.skill, min_level=req.min_level, weight=req.weight, mandatory=req.mandatory))
    db.commit()
    return {"id": r.id}

@router.get("/roles")
def list_roles(db: Session = Depends(get_db)):
    roles = db.execute(select(Role)).scalars().all()
    return [{"id": r.id, "unit": r.unit, "title": r.title} for r in roles]
