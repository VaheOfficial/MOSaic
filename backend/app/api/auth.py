from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.db import get_db
from app.core.auth import create_token, hash_password, verify_password, get_current_user
from app.core.schema import Token, UserOut, LoginRequest, RegisterRequest
from app.models.base import User


router = APIRouter()


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.execute(select(User).where(User.username == payload.username)).scalars().first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(sub=user.username, role=user.role)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return UserOut(id=user.id, username=user.username, full_name=user.full_name, role=user.role)


@router.post("/seed-demo")
def seed_demo(db: Session = Depends(get_db)):
    if db.query(User).count() == 0:
        users = [
            User(username="member1", full_name="Member One", role="member", hashed_password=hash_password("member")),
            User(username="super1", full_name="Supervisor One", role="supervisor", hashed_password=hash_password("super")),
            User(username="comm1", full_name="Commander One", role="commander", hashed_password=hash_password("commander")),
        ]
        for u in users:
            db.add(u)
        db.commit()
    return {"ok": True}


@router.post("/register", response_model=Token)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.execute(select(User).where(User.username == payload.username)).scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    user = User(
        username=payload.username,
        full_name=payload.full_name,
        role=payload.role,
        hashed_password=hash_password(payload.password),
    )
    db.add(user); db.commit(); db.refresh(user)
    token = create_token(sub=user.username, role=user.role)
    return {"access_token": token, "token_type": "bearer"}


