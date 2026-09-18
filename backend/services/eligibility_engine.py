"""
Deterministic eligibility engine. This is the ONLY code allowed to decide
PASS/FAIL/MISSING/UNVERIFIABLE or the overall scheme status. Nothing downstream
(retrieval, LLM explanation) may change what this module returns.
"""

import json
from pathlib import Path

from models.schemas import Criterion, ProfileInput

SCHEMES_PATH = Path(__file__).resolve().parents[1] / "data" / "schemes.json"

_CACHE: list[dict] | None = None


def load_schemes() -> list[dict]:
    global _CACHE
    if _CACHE is None:
        _CACHE = json.loads(SCHEMES_PATH.read_text())
    return _CACHE


def _check_age(profile: ProfileInput, elig: dict) -> Criterion:
    min_age, max_age = elig.get("min_age"), elig.get("max_age")
    required = f"{min_age or 0}-{max_age if max_age is not None else '+'}"
    if profile.age is None:
        return Criterion(criterion="age", required=required, provided=None, status="MISSING")
    ok = True
    if min_age is not None and profile.age < min_age:
        ok = False
    if max_age is not None and profile.age > max_age:
        ok = False
    return Criterion(criterion="age", required=required, provided=str(profile.age), status="PASS" if ok else "FAIL")


def _check_income(profile: ProfileInput, elig: dict) -> Criterion:
    min_income, max_income = elig.get("min_income"), elig.get("max_income")
    if min_income is None and max_income is None:
        return None  # no income rule for this scheme
    required = f">= {min_income}" if min_income and not max_income else f"<= {max_income}" if max_income else f"{min_income}-{max_income}"
    if profile.income is None:
        return Criterion(criterion="income", required=required, provided=None, status="MISSING")
    ok = True
    if min_income is not None and profile.income < min_income:
        ok = False
    if max_income is not None and profile.income > max_income:
        ok = False
    return Criterion(criterion="income", required=required, provided=str(profile.income), status="PASS" if ok else "FAIL")


def _check_gender(profile: ProfileInput, elig: dict) -> Criterion:
    required_gender = elig.get("gender", "all")
    if required_gender in (None, "all"):
        return None
    if profile.gender is None:
        return Criterion(criterion="gender", required=required_gender, provided=None, status="MISSING")
    ok = profile.gender.lower() == required_gender.lower()
    return Criterion(criterion="gender", required=required_gender, provided=profile.gender, status="PASS" if ok else "FAIL")


_ALL_CATEGORIES = {"general", "obc", "sc", "st"}


def _check_category(profile: ProfileInput, elig: dict) -> Criterion:
    allowed = elig.get("category") or []
    if not allowed or set(c.lower() for c in allowed) >= _ALL_CATEGORIES:
        return None  # no real restriction if every base category is allowed
    if profile.category is None:
        return Criterion(criterion="category", required=", ".join(allowed), provided=None, status="MISSING")
    ok = profile.category.lower() in [c.lower() for c in allowed]
    return Criterion(criterion="category", required=", ".join(allowed), provided=profile.category, status="PASS" if ok else "FAIL")


def _check_occupation(profile: ProfileInput, elig: dict) -> Criterion:
    allowed = elig.get("occupation") or []
    if not allowed:
        return None
    if profile.occupation is None:
        return Criterion(criterion="occupation", required=", ".join(allowed), provided=None, status="MISSING")
    ok = profile.occupation.lower() in [o.lower() for o in allowed]
    return Criterion(criterion="occupation", required=", ".join(allowed), provided=profile.occupation, status="PASS" if ok else "FAIL")


def _check_state(profile: ProfileInput, elig: dict) -> Criterion:
    allowed_states = elig.get("states", "all")
    if allowed_states in (None, "all"):
        return None
    if profile.state is None:
        return Criterion(criterion="state", required=str(allowed_states), provided=None, status="MISSING")
    allowed_list = allowed_states if isinstance(allowed_states, list) else [allowed_states]
    ok = profile.state.lower() in [s.lower() for s in allowed_list]
    return Criterion(criterion="state", required=str(allowed_states), provided=profile.state, status="PASS" if ok else "FAIL")


_CHECKS = [_check_age, _check_income, _check_gender, _check_category, _check_occupation, _check_state]


def evaluate_scheme(profile: ProfileInput, scheme: dict) -> list[Criterion]:
    elig = scheme.get("eligibility", {})
    criteria = [check(profile, elig) for check in _CHECKS]
    return [c for c in criteria if c is not None]


def overall_status(criteria: list[Criterion]) -> str:
    if any(c.status == "FAIL" for c in criteria):
        return "NOT_ELIGIBLE"
    if any(c.status in ("MISSING", "UNVERIFIABLE") for c in criteria):
        return "NEEDS_MORE_INFORMATION"
    return "POTENTIALLY_ELIGIBLE"
