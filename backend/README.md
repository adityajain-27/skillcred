# Backend — Government Scheme Eligibility Navigator

## Golden rule
`services/eligibility_engine.py` is the only place eligibility is decided
(PASS/FAIL/MISSING/UNVERIFIABLE, and the overall status). `services/retrieval.py`
only looks up/searches evidence text. `services/llm.py` only rewords an
already-decided result. Neither of the latter two can change a status.

## Setup
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env      # optional: fill in GROQ_API_KEY to enable AI explanations
uvicorn main:app --reload
pytest                     # run the test suite
```

Runnable right now end-to-end with 12 real curated schemes in `data/schemes.json`.

## Folder map

| Path | What it does |
|---|---|
| `models/schemas.py` | Pydantic request/response shapes (`ProfileInput`, `Criterion`, `SchemeResult`, ...) |
| `data/schemes.json` | 12 curated real schemes: eligibility rules, documents, evidence text, source |
| `services/eligibility_engine.py` | Deterministic PASS/FAIL/MISSING checks + overall status rollup |
| `services/retrieval.py` | `get_evidence()` direct lookup; `search()` TF-IDF ranking across schemes |
| `services/llm.py` | Groq call that rewords a finished verdict into plain language (needs `GROQ_API_KEY`) |
| `api/eligibility.py` | `POST /api/eligibility` — the main endpoint |
| `api/schemes.py` | `GET /api/schemes`, `GET /api/schemes/{id}` — browse without a profile |
| `main.py` | FastAPI app entrypoint |
| `tests/test_eligibility_engine.py` | Edge cases: eligible, not eligible, missing info, boundary age/income, gender mismatch |

## API

```
POST /api/eligibility?explain=false
body: { age, state, occupation, income, gender, category }   (all optional)
→ { "results": [ { scheme_id, scheme_name, status, criteria, documents, evidence, explanation } ] }
```
`explain=true` calls Groq per scheme to add a plain-language `explanation` object — off by
default to keep the endpoint fast; requires `GROQ_API_KEY` in `.env`.

```
GET /api/schemes            → list of {scheme_id, name, ministry, description}
GET /api/schemes/{scheme_id} → full scheme record
```

## Adding a new scheme
Add an entry to `data/schemes.json` with the same shape as the existing ones:
`eligibility` (min/max age, gender, min/max income, category list, occupation list,
states), `documents_required`, `evidence_text` (a real sentence from the scheme's
official guidelines — this is what gets shown as the citation), and `source`.

If a real criterion is too vague to express as a clean rule (e.g. "priority to
needy applicants"), don't force it into a fake number — that's what the
`UNVERIFIABLE` status is for; leave it out of `eligibility` and note it in
`description` instead for now.

## Raw source data (not used directly by the app)
- `../schemes.json` (repo root, if present) — earlier draft dataset, superseded by `data/schemes.json`.
- `../updated_data.xlsx` — 3,400 real schemes scraped from a government portal, with
  unstructured eligibility text. Useful as a backlog to pull more schemes from later,
  not processed yet — eligibility text there needs manual/LLM extraction into the
  structured shape above before it can be added to `data/schemes.json`.
