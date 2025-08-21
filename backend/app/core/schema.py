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

class MemberSurvey(BaseModel):
    person_id: Optional[int] = None
    data: Dict[str, Any]

class SupervisorSurvey(BaseModel):
    role_id: Optional[int] = None
    data: Dict[str, Any]

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
