from app.core.db import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey, Float, Boolean, JSON, Text

class Person(Base):
    __tablename__ = "people"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120))
    grade: Mapped[str | None] = mapped_column(String(16), nullable=True)
    unit: Mapped[str | None] = mapped_column(String(64), nullable=True)
    dafsc: Mapped[str | None] = mapped_column(String(16), nullable=True)
    duty_title: Mapped[str | None] = mapped_column(String(128), nullable=True)
    clearance: Mapped[str | None] = mapped_column(String(32), nullable=True)
    base: Mapped[str | None] = mapped_column(String(64), nullable=True)
    command: Mapped[str | None] = mapped_column(String(64), nullable=True)

class Role(Base):
    __tablename__ = "roles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    unit: Mapped[str] = mapped_column(String(64))
    title: Mapped[str] = mapped_column(String(128))
    min_grade: Mapped[str | None] = mapped_column(String(16), nullable=True)
    clearance_req: Mapped[str | None] = mapped_column(String(32), nullable=True)
    relocation_allowed: Mapped[str | None] = mapped_column(String(32), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

class RoleRequirement(Base):
    __tablename__ = "role_requirements"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    role_id: Mapped[int] = mapped_column(ForeignKey("roles.id"))
    skill: Mapped[str] = mapped_column(String(64))
    min_level: Mapped[int] = mapped_column(Integer, default=1)
    weight: Mapped[float] = mapped_column(Float, default=1.0)
    mandatory: Mapped[bool] = mapped_column(Boolean, default=False)

class SurveyMember(Base):
    __tablename__ = "surveys_member"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    person_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    data: Mapped[dict] = mapped_column(JSON)

class SurveySupervisor(Base):
    __tablename__ = "surveys_supervisor"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    role_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    data: Mapped[dict] = mapped_column(JSON)
