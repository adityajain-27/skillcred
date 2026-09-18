from fastapi import APIRouter, HTTPException

from services.eligibility_engine import load_schemes

router = APIRouter(prefix="/api", tags=["schemes"])


@router.get("/schemes")
def list_schemes():
    return [
        {
            "scheme_id": s["scheme_id"],
            "name": s["name"],
            "ministry": s["ministry"],
            "description": s["description"],
            "category": s["category"],
            "tags": s["tags"],
            "benefits": s["benefits"],
        }
        for s in load_schemes()
    ]


@router.get("/schemes/{scheme_id}")
def scheme_detail(scheme_id: str):
    for s in load_schemes():
        if s["scheme_id"] == scheme_id:
            return s
    raise HTTPException(status_code=404, detail="scheme not found")
