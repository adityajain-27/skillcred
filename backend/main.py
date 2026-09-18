from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import eligibility, schemes

app = FastAPI(title="Government Scheme Eligibility Navigator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(eligibility.router)
app.include_router(schemes.router)


@app.get("/health")
def health():
    return {"status": "ok"}
