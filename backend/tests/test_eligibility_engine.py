from models.schemas import ProfileInput
from services.eligibility_engine import evaluate_scheme, load_schemes, overall_status

PM_KISAN = next(s for s in load_schemes() if s["scheme_id"] == "pm-kisan-samman-nidhi")
AYUSHMAN = next(s for s in load_schemes() if s["scheme_id"] == "ayushman-bharat-pmjay")


def test_clearly_eligible_farmer():
    profile = ProfileInput(age=42, occupation="farmer")
    criteria = evaluate_scheme(profile, PM_KISAN)
    assert overall_status(criteria) == "POTENTIALLY_ELIGIBLE"


def test_clearly_non_eligible_wrong_occupation():
    profile = ProfileInput(age=30, occupation="teacher")
    criteria = evaluate_scheme(profile, PM_KISAN)
    assert overall_status(criteria) == "NOT_ELIGIBLE"


def test_missing_required_field():
    profile = ProfileInput(age=42)  # occupation not provided
    criteria = evaluate_scheme(profile, PM_KISAN)
    assert overall_status(criteria) == "NEEDS_MORE_INFORMATION"


def test_income_exactly_at_max_boundary_passes():
    profile = ProfileInput(age=30, income=100000)
    criteria = evaluate_scheme(profile, AYUSHMAN)
    income_criterion = next(c for c in criteria if c.criterion == "income")
    assert income_criterion.status == "PASS"


def test_income_one_over_max_boundary_fails():
    profile = ProfileInput(age=30, income=100001)
    criteria = evaluate_scheme(profile, AYUSHMAN)
    income_criterion = next(c for c in criteria if c.criterion == "income")
    assert income_criterion.status == "FAIL"
    assert overall_status(criteria) == "NOT_ELIGIBLE"


def test_age_exactly_at_min_boundary_passes():
    profile = ProfileInput(age=18, occupation="farmer")
    criteria = evaluate_scheme(profile, PM_KISAN)
    age_criterion = next(c for c in criteria if c.criterion == "age")
    assert age_criterion.status == "PASS"


def test_gender_mismatch_fails():
    from models.schemas import ProfileInput as P

    ujjwala = next(s for s in load_schemes() if s["scheme_id"] == "pm-ujjwala-yojana")
    profile = P(age=30, gender="male", income=50000)
    criteria = evaluate_scheme(profile, ujjwala)
    gender_criterion = next(c for c in criteria if c.criterion == "gender")
    assert gender_criterion.status == "FAIL"
