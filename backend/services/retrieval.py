"""
Evidence retrieval. Every scheme's evidence_text is treated as its passage.
get_evidence() returns it directly (score=1.0) since each scheme has exactly
one curated passage right now. search() does real TF-IDF/cosine ranking across
all scheme passages for free-text queries (used by the stretch-goal ask endpoint,
not required for the core eligibility flow).
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from models.schemas import Evidence
from services.eligibility_engine import load_schemes


def get_evidence(scheme: dict) -> Evidence:
    return Evidence(
        scheme_id=scheme["scheme_id"],
        source=scheme["source"]["title"],
        text=scheme["evidence_text"],
        score=1.0,
    )


def search(query: str, top_k: int = 3) -> list[Evidence]:
    schemes = load_schemes()
    texts = [s["evidence_text"] for s in schemes]
    vectorizer = TfidfVectorizer(stop_words="english")
    matrix = vectorizer.fit_transform(texts + [query])
    scores = cosine_similarity(matrix[-1], matrix[:-1])[0]
    ranked = sorted(zip(schemes, scores), key=lambda pair: pair[1], reverse=True)[:top_k]
    return [
        Evidence(scheme_id=s["scheme_id"], source=s["source"]["title"], text=s["evidence_text"], score=round(float(score), 3))
        for s, score in ranked
        if score > 0
    ]
