"""
Main endpoint. One call: profile in, full eligibility results (with evidence and
optional AI explanation) out. See services/eligibility_engine.py for the part that
actually decides PASS/FAIL/MISSING - this module only orchestrates.
"""

import os

from fastapi import APIRouter

from models.schemas import EligibilityResponse, ProfileInput, SchemeResult
from services.eligibility_engine import evaluate_scheme, load_schemes, overall_status
from services.retrieval import get_evidence

router = APIRouter(prefix="/api", tags=["eligibility"])


@router.post("/eligibility", response_model=EligibilityResponse)
def check_eligibility(profile: ProfileInput, explain: bool = False):
    results = []
    for scheme in load_schemes():
        criteria = evaluate_scheme(profile, scheme)
        status = overall_status(criteria)
        evidence = get_evidence(scheme)

        explanation = None
        if explain and os.environ.get("GROQ_API_KEY"):
            from services.llm import explain as explain_fn  # deferred import: avoid requiring a key at startup

            explanation = explain_fn(
                profile=profile.model_dump(),
                scheme_name=scheme["name"],
                status=status,
                criteria=criteria,
                documents=scheme["documents_required"],
                evidence=evidence,
            )

        results.append(
            SchemeResult(
                scheme_id=scheme["scheme_id"],
                scheme_name=scheme["name"],
                status=status,
                criteria=criteria,
                documents=scheme["documents_required"],
                evidence=[evidence],
                explanation=explanation,
            )
        )
    return EligibilityResponse(results=results)
