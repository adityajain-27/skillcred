"""
Evidence retrieval. Every scheme's evidence_text is treated as its passage.
get_evidence() returns it directly (score=1.0) since each scheme has exactly
one curated passage right now. search() does semantic vector search (sentence
embeddings + FAISS) across all scheme passages for free-text queries (used by
the stretch-goal ask endpoint, not required for the core eligibility flow).
"""

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

from models.schemas import Evidence
from services.eligibility_engine import load_schemes

_MODEL_NAME = "all-MiniLM-L6-v2"

_model: SentenceTransformer | None = None
_index: faiss.Index | None = None
_indexed_schemes: list[dict] | None = None


def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer(_MODEL_NAME)
    return _model


def _get_index() -> tuple[faiss.Index, list[dict]]:
    """Builds (once) and caches a FAISS index over every scheme's evidence_text."""
    global _index, _indexed_schemes
    if _index is None:
        schemes = load_schemes()
        embeddings = _get_model().encode([s["evidence_text"] for s in schemes], normalize_embeddings=True)
        index = faiss.IndexFlatIP(embeddings.shape[1])  # inner product on normalized vectors = cosine similarity
        index.add(np.asarray(embeddings, dtype="float32"))
        _index, _indexed_schemes = index, schemes
    return _index, _indexed_schemes


def get_evidence(scheme: dict) -> Evidence:
    return Evidence(
        scheme_id=scheme["scheme_id"],
        source=scheme["source"]["title"],
        text=scheme["evidence_text"],
        score=1.0,
    )


def search(query: str, top_k: int = 3) -> list[Evidence]:
    index, schemes = _get_index()
    query_vec = _get_model().encode([query], normalize_embeddings=True)
    scores, indices = index.search(np.asarray(query_vec, dtype="float32"), top_k)
    return [
        Evidence(scheme_id=s["scheme_id"], source=s["source"]["title"], text=s["evidence_text"], score=round(float(score), 3))
        for score, idx in zip(scores[0], indices[0])
        for s in [schemes[idx]]
        if idx != -1 and score > 0
    ]
