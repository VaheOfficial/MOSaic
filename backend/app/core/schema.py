from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SURFIdentity(BaseModel):
    grade: Optional[str] = None
    date_of_rank: Optional[str] = None
    name: Optional[str] = None
    ssn_last4: Optional[str] = None
    projected_grade: Optional[str] = None
    dafsc: Optional[str] = None
    duty_title: Optional[str] = None
    pas: Optional[str] = None
    base: Optional[str] = None
    command: Optional[str] = None
    dependents: Optional[str] = None
    sex_race_eth: Optional[str] = None

class SURFServiceDates(BaseModel):
    das: Optional[str] = None
    dos: Optional[str] = None
    hyt: Optional[str] = None
    deros: Optional[str] = None
    adscd: Optional[str] = None
    tafmsd: Optional[str] = None
    odsd: Optional[str] = None
    ead: Optional[str] = None
    pay_date: Optional[str] = None
    strd: Optional[str] = None

class SURFAFSCInfo(BaseModel):
    cafsc: Optional[str] = None
    pafsc: Optional[str] = None
    afsc2: Optional[str] = None
    afsc3: Optional[str] = None
    psei: Optional[str] = None
    weapon_system_background_id: Optional[str] = None
    return_to_fly_date: Optional[str] = None

class SURFHeader(BaseModel):
    printed_by: Optional[str] = None
    printed_at: Optional[str] = None
    as_of: Optional[str] = None
    privacy_notice: Optional[str] = None

class SURF(BaseModel):
    header: Optional[SURFHeader] = None
    identity: Optional[SURFIdentity] = None
    service_dates: Optional[SURFServiceDates] = None
    afsc_info: Optional[SURFAFSCInfo] = None
    assignments: Optional[list] = None
    decorations: Optional[list] = None
    pme: Optional[list] = None

# Legacy models for backward compatibility
class MemberSurvey(BaseModel):
    person_id: Optional[int] = None
    data: Dict[str, Any]

class SupervisorSurvey(BaseModel):
    role_id: Optional[int] = None
    data: Dict[str, Any]

# New structured models
class PersonalInfo(BaseModel):
    full_name: str
    rank: str
    unit: str
    duty_position: str
    years_service: int = 0
    clearance_level: Optional[str] = None

class SkillsExperience(BaseModel):
    primary_skills: List[str]
    certifications: List[str] = []
    specialty_areas: List[str] = []
    tools: List[str] = []
    experience_summary: str = ""

class CareerPreferences(BaseModel):
    career_goals: str
    preferred_roles: List[str] = []
    avoid_roles: List[str] = []
    willing_to_relocate: str = "Maybe"
    deployment_availability: str = "Available"

class AdditionalInfo(BaseModel):
    language_skills: List[str] = []
    additional_information: str = ""

class MemberProfile(BaseModel):
    personal_info: PersonalInfo
    skills_experience: SkillsExperience
    career_preferences: CareerPreferences
    additional_info: AdditionalInfo

class MemberInfoEval(BaseModel):
    name: str
    rank: str
    unit: str = ""

class EvaluationInfo(BaseModel):
    period: str
    supervisor_name: str
    relationship_duration: str = ""

class PerformanceRatings(BaseModel):
    technical_competence: int = 3
    leadership_ability: int = 3
    communication: int = 3
    reliability: int = 3
    adaptability: int = 3
    initiative: int = 3
    teamwork: int = 3
    professional_development: int = 3

class QualitativeAssessment(BaseModel):
    key_strengths: List[str]
    improvement_areas: List[str] = []
    significant_achievements: str
    training_recommendations: List[str] = []

class CareerDevelopment(BaseModel):
    promotion_readiness: str = "Ready in 6 months"
    career_advice: str
    assignment_recommendations: str = ""
    overall_assessment: str

class SupervisorEvaluation(BaseModel):
    member_info: MemberInfoEval
    evaluation_info: EvaluationInfo
    performance_ratings: PerformanceRatings
    qualitative_assessment: QualitativeAssessment
    career_development: CareerDevelopment

class RoleRequirementIn(BaseModel):
    skill: str
    min_level: int = 1
    weight: float = 1.0
    mandatory: bool = False

class RoleIn(BaseModel):
    unit: str
    title: str
    min_grade: Optional[str] = None
    clearance_req: Optional[str] = None
    relocation_allowed: Optional[str] = None
    notes: Optional[str] = None
    requirements: List[RoleRequirementIn] = Field(default_factory=list)

class Course(BaseModel):
    id: str
    provider: str
    title: str
    url: str
    skills: List[str]

class MatchRunRequest(BaseModel):
    unit: str
    top_k: int = 3

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: int
    username: str
    full_name: Optional[str] = None
    role: str

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    full_name: Optional[str] = None
    role: str