"""
LLM explanation layer (Groq). Receives an already-decided eligibility result and
only rewords it into structured plain language. Must never introduce a criterion,
document, or eligibility fact that isn't in its input.
"""

import json
import os

from groq import Groq

from models.schemas import Criterion, Evidence, Explanation

_SYSTEM_PROMPT = """You explain government scheme eligibility results to citizens.
You will receive: the citizen's profile, a deterministic eligibility status that has
ALREADY been decided, a list of criteria with PASS/FAIL/MISSING/UNVERIFIABLE statuses,
required documents, and a retrieved evidence passage from the scheme's official
guidelines.

Rules:
- Do NOT change the status. Do NOT invent criteria, documents, or benefits.
- Do NOT decide eligibility yourself - only explain what was already decided.
- If a criterion is UNVERIFIABLE, say plainly it could not be automatically checked.
- Base your explanation only on the data given, citing the evidence passage where relevant.
- Respond with ONLY a JSON object matching this shape:
{
  "summary": "...",
  "why_it_matches": ["..."],
  "why_it_does_not_match": ["..."],
  "why_it_cannot_be_determined": ["..."],
  "missing_information": ["..."],
  "required_documents": ["..."],
  "next_steps": ["..."]
}
Leave irrelevant arrays empty rather than omitting keys.
"""

_client: Groq | None = None


def _get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=os.environ["GROQ_API_KEY"])
    return _client


def explain(
    profile: dict,
    scheme_name: str,
    status: str,
    criteria: list[Criterion],
    documents: list[str],
    evidence: Evidence,
) -> Explanation:
    client = _get_client()
    user_content = json.dumps(
        {
            "profile": profile,
            "scheme_name": scheme_name,
            "status": status,
            "criteria": [c.model_dump() for c in criteria],
            "required_documents": documents,
            "evidence": evidence.model_dump(),
        }
    )
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ],
        temperature=0.2,
        response_format={"type": "json_object"},
    )
    data = json.loads(completion.choices[0].message.content)
    return Explanation(**data)
