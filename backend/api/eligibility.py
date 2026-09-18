"""
Main endpoint. One call: profile in, full eligibility results (with evidence and
optional AI explanation) out. See services/eligibility_engine.py for the part that
actually decides PASS/FAIL/MISSING - this module only orchestrates.

Explanations for all schemes are requested in a single batched LLM call (see
services/llm.py::explain_batch) rather than one call per scheme, to stay within
the LLM provider's free-tier rate limit.
"""

import os

from fastapi import APIRouter

from models.schemas import EligibilityResponse, ProfileInput, SchemeResult
from services.eligibility_engine import evaluate_scheme, load_schemes, overall_status
from services.retrieval import get_evidence

router = APIRouter(prefix="/api", tags=["eligibility"])


@router.post("/eligibility", response_model=EligibilityResponse)
def check_eligibility(profile: ProfileInput, explain: bool = False):
    schemes = load_schemes()
    evaluated = []
    for scheme in schemes:
        criteria = evaluate_scheme(profile, scheme)
        status = overall_status(criteria)
        evidence = get_evidence(scheme)
        evaluated.append({"scheme": scheme, "criteria": criteria, "status": status, "evidence": evidence})

    explanations: dict[str, object] = {}
    if explain and os.environ.get("GEMINI_API_KEY"):
        from services.llm import explain_batch  # deferred import: avoid requiring a key at startup

        batch_items = [
            {
                "scheme_id": e["scheme"]["scheme_id"],
                "scheme_name": e["scheme"]["name"],
                "status": e["status"],
                "criteria": [c.model_dump() for c in e["criteria"]],
                "required_documents": e["scheme"]["documents_required"],
                "evidence": e["evidence"].model_dump(),
            }
            for e in evaluated
        ]
        explanations = explain_batch(batch_items)

    results = [
        SchemeResult(
            scheme_id=e["scheme"]["scheme_id"],
            scheme_name=e["scheme"]["name"],
            ministry=e["scheme"]["ministry"],
            description=e["scheme"]["description"],
            category=e["scheme"]["category"],
            tags=e["scheme"]["tags"],
            benefits=e["scheme"]["benefits"],
            source_url=e["scheme"]["source"]["url"],
            status=e["status"],
            criteria=e["criteria"],
            documents=e["scheme"]["documents_required"],
            evidence=[e["evidence"]],
            explanation=explanations.get(e["scheme"]["scheme_id"]),
        )
        for e in evaluated
    ]
    return EligibilityResponse(results=results)
