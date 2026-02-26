import os
import pathlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from db.mongo import connect_db, close_db
from routers import auth, sessions, interview, feedback

# Absolute-path load so uvicorn --reload always finds the key
_ENV_PATH = pathlib.Path(__file__).parent / ".env"
load_dotenv(dotenv_path=_ENV_PATH, override=True)

ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "http://localhost:3000")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Connect to MongoDB on startup, close on shutdown."""
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="InterviewIQ API",
    description="AI-powered mock interview backend — Powered by Google Gemini",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS — allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOWED_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth.router)
app.include_router(sessions.router)
app.include_router(interview.router)
app.include_router(feedback.router)


@app.get("/", tags=["health"])
async def root():
    return {"status": "ok", "service": "InterviewIQ API", "version": "1.0.0"}


@app.get("/health", tags=["health"])
async def health():
    return {"status": "healthy"}
