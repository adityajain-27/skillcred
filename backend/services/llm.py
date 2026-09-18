"""
LLM explanation layer (Gemini). Receives already-decided eligibility results (for
every scheme in one batch, to stay within the free-tier rate limit) and only
rewords them into structured plain language. Must never introduce a criterion,
document, or eligibility fact that isn't in its input, and must never change a
status that the deterministic engine already decided.
"""

import json
import os

from google import genai
from google.genai import types

from models.schemas import Criterion, Evidence, Explanation

_SYSTEM_PROMPT = """You explain government scheme eligibility results to citizens.
You will receive a JSON array. Each item has: scheme_id, scheme_name, a deterministic
eligibility status that has ALREADY been decided, a list of criteria with
PASS/FAIL/MISSING/UNVERIFIABLE statuses, required documents, and a retrieved evidence
passage from that scheme's official guidelines.

Rules:
- Do NOT change any status. Do NOT invent criteria, documents, or benefits.
- Do NOT decide eligibility yourself - only explain what was already decided.
- If a criterion is UNVERIFIABLE, say plainly it could not be automatically checked.
- Base each explanation only on that scheme's own data, citing its evidence passage
  where relevant.
- Respond with ONLY a JSON object whose keys are each input item's scheme_id, and
  whose values match this shape:
{
  "summary": "...",
  "why_it_matches": ["..."],
  "why_it_does_not_match": ["..."],
  "why_it_cannot_be_determined": ["..."],
  "missing_information": ["..."],
  "required_documents": ["..."],
  "next_steps": ["..."]
}
Leave irrelevant arrays empty rather than omitting keys. Include every scheme_id from
the input, in the same order.
"""

_MODEL_NAME = "gemini-2.5-flash"

_client: genai.Client | None = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        _client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    return _client


def explain_batch(items: list[dict]) -> dict[str, Explanation]:
    """items: list of {scheme_id, scheme_name, status, criteria, documents, evidence}.
    Returns a dict mapping scheme_id -> Explanation. One Gemini call for the whole batch."""
    client = _get_client()
    user_content = json.dumps(items)
    response = client.models.generate_content(
        model=_MODEL_NAME,
        contents=user_content,
        config=types.GenerateContentConfig(
            system_instruction=_SYSTEM_PROMPT,
            temperature=0.2,
            response_mime_type="application/json",
        ),
    )
    data = json.loads(response.text)
    return {scheme_id: Explanation(**payload) for scheme_id, payload in data.items()}
