"""Shared request/response shapes for the eligibility API."""

from typing import Literal, Optional
from pydantic import BaseModel

CriterionStatus = Literal["PASS", "FAIL", "MISSING", "UNVERIFIABLE"]
OverallStatus = Literal["POTENTIALLY_ELIGIBLE", "NOT_ELIGIBLE", "NEEDS_MORE_INFORMATION"]


class ProfileInput(BaseModel):
    age: Optional[int] = None
    state: Optional[str] = None
    occupation: Optional[str] = None
    income: Optional[float] = None
    gender: Optional[str] = None
    category: Optional[str] = None


class Criterion(BaseModel):
    criterion: str
    required: str
    provided: Optional[str] = None
    status: CriterionStatus


class Evidence(BaseModel):
    scheme_id: str
    source: str
    text: str
    score: float


class Explanation(BaseModel):
    summary: str
    why_it_matches: list[str] = []
    why_it_does_not_match: list[str] = []
    why_it_cannot_be_determined: list[str] = []
    missing_information: list[str] = []
    required_documents: list[str] = []
    next_steps: list[str] = []


class SchemeResult(BaseModel):
    scheme_id: str
    scheme_name: str
    ministry: str
    description: str
    category: str
    tags: list[str]
    benefits: str
    source_url: str
    status: OverallStatus
    criteria: list[Criterion]
    documents: list[str]
    evidence: list[Evidence]
    explanation: Optional[Explanation] = None


class EligibilityResponse(BaseModel):
    results: list[SchemeResult]
