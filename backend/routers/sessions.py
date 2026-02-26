from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from db.mongo import get_db
from models.session import SessionOut, SessionListItem, SessionStatus
from utils.auth import get_current_user
from services.pdf_parser import extract_text_from_pdf

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("/start", response_model=SessionOut, status_code=201)
async def start_session(
    role: str = Form(...),
    level: str = Form(...),
    rounds: str = Form(...),            # comma-separated e.g. "technical,behavioral"
    job_description: str = Form(...),
    resume: Optional[UploadFile] = File(None),
    user_id: str = Depends(get_current_user),
):
    db = get_db()

    # Parse resume PDF if provided
    resume_text = ""
    if resume and resume.filename:
        if not resume.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Resume must be a PDF file")
        resume_text = await extract_text_from_pdf(resume)

    rounds_list = [r.strip() for r in rounds.split(",") if r.strip()]

    session_doc = {
        "user_id": user_id,
        "role": role,
        "level": level,
        "rounds": rounds_list,
        "resume_text": resume_text,
        "job_description": job_description,
        "status": SessionStatus.active,
        "current_round": rounds_list[0] if rounds_list else "general",
        "question_count": 0,
        "created_at": datetime.utcnow(),
        "completed_at": None,
        "overall_score": None,
        "category_scores": None,
    }
    result = await db["sessions"].insert_one(session_doc)

    return SessionOut(
        id=str(result.inserted_id),
        user_id=user_id,
        role=role,
        level=level,
        rounds=rounds_list,
        status=SessionStatus.active,
        created_at=session_doc["created_at"],
        question_count=0,
    )


@router.get("", response_model=List[SessionListItem])
async def list_sessions(user_id: str = Depends(get_current_user)):
    db = get_db()
    cursor = db["sessions"].find(
        {"user_id": user_id},
        sort=[("created_at", -1)],
        limit=20
    )
    sessions = []
    async for doc in cursor:
        sessions.append(SessionListItem(
            id=str(doc["_id"]),
            role=doc["role"],
            level=doc["level"],
            rounds=doc["rounds"],
            status=doc["status"],
            created_at=doc["created_at"],
            overall_score=doc.get("overall_score"),
            question_count=doc.get("question_count", 0),
        ))
    return sessions


@router.get("/{session_id}", response_model=SessionOut)
async def get_session(session_id: str, user_id: str = Depends(get_current_user)):
    db = get_db()
    doc = await db["sessions"].find_one({"_id": ObjectId(session_id), "user_id": user_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Session not found")

    return SessionOut(
        id=str(doc["_id"]),
        user_id=doc["user_id"],
        role=doc["role"],
        level=doc["level"],
        rounds=doc["rounds"],
        status=doc["status"],
        created_at=doc["created_at"],
        completed_at=doc.get("completed_at"),
        overall_score=doc.get("overall_score"),
        category_scores=doc.get("category_scores"),
        question_count=doc.get("question_count", 0),
    )
