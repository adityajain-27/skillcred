# Government Scheme Eligibility Navigator

Citizens fill a profile form → deterministic rule engine checks it against structured
scheme eligibility rules → shortlist of matching schemes with citations to source
documents, gap analysis for missing/failed criteria, and a document checklist.

## Repo layout

```
backend/    FastAPI + rule engine + ML/retrieval + scraper  (see backend/README.md)
frontend/   React app (owned by frontend team)
```

## Core rule (read this before touching anything)

The rule engine (`backend/app/core/rule_engine.py`) is the ONLY thing allowed to decide
eligibility. Retrieval and the LLM explain layer may only add evidence/wording on top of
a verdict that already exists — never re-decide it.

## Getting started

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env      # fill in GROQ_API_KEY
uvicorn app.main:app --reload
```

See `backend/README.md` for how work is split across the team.
