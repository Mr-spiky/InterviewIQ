from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from typing import List, Dict, Any

from db.mongo import get_db
from utils.auth import get_current_user
from services.gemini import generate_feedback_report

router = APIRouter(prefix="/feedback", tags=["feedback"])


@router.post("/generate/{session_id}")
async def generate_feedback(
    session_id: str,
    user_id: str = Depends(get_current_user),
):
    """
    Generates the full AI feedback report for a completed session.
    Saves scores to the session document.
    """
    db = get_db()

    # Load session
    session = await db["sessions"].find_one({
        "_id": ObjectId(session_id),
        "user_id": user_id,
    })
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Load full transcript
    transcript = []
    async for msg in db["messages"].find(
        {"session_id": session_id},
        sort=[("timestamp", 1)]
    ):
        transcript.append({
            "role": msg["role"],
            "content": msg["content"],
            "score": msg.get("score"),
            "feedback": msg.get("feedback"),
            "weak_points": msg.get("weak_points", []),
        })

    if len(transcript) < 2:
        raise HTTPException(status_code=400, detail="Not enough transcript data to generate feedback")

    # Generate feedback via Gemini
    report = await generate_feedback_report(
        role=session["role"],
        level=session["level"],
        rounds=session["rounds"],
        transcript=transcript,
    )

    # Persist full report on the session
    await db["sessions"].update_one(
        {"_id": ObjectId(session_id)},
        {"$set": {
            "overall_score": report.get("overall_score"),
            "category_scores": report.get("category_scores", {}),
            "strengths": report.get("strengths", []),
            "improvements": report.get("improvements", []),
            "summary": report.get("summary", ""),
            "recommendation": report.get("recommendation", ""),
            "status": "completed",
        }}
    )

    return {
        "session_id": session_id,
        "role": session["role"],
        "level": session["level"],
        "rounds": session["rounds"],
        "overall_score": report.get("overall_score"),
        "category_scores": report.get("category_scores"),
        "strengths": report.get("strengths", []),
        "improvements": report.get("improvements", []),
        "summary": report.get("summary", ""),
        "recommendation": report.get("recommendation", ""),
        "transcript": transcript,
    }


@router.get("/{session_id}")
async def get_feedback(
    session_id: str,
    user_id: str = Depends(get_current_user),
):
    """
    Retrieve already-generated feedback for a completed session.
    """
    db = get_db()

    session = await db["sessions"].find_one({
        "_id": ObjectId(session_id),
        "user_id": user_id,
    })
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if not session.get("overall_score"):
        raise HTTPException(status_code=400, detail="Feedback not yet generated. Call POST /feedback/generate first.")

    # Load transcript
    transcript = []
    async for msg in db["messages"].find(
        {"session_id": session_id},
        sort=[("timestamp", 1)]
    ):
        transcript.append({
            "role": msg["role"],
            "content": msg["content"],
            "score": msg.get("score"),
            "feedback": msg.get("feedback"),
            "weak_points": msg.get("weak_points", []),
        })

    return {
        "session_id": session_id,
        "role": session["role"],
        "level": session["level"],
        "rounds": session["rounds"],
        "overall_score": session.get("overall_score"),
        "category_scores": session.get("category_scores", {}),
        "strengths": session.get("strengths", []),
        "improvements": session.get("improvements", []),
        "summary": session.get("summary", ""),
        "recommendation": session.get("recommendation", ""),
        "transcript": transcript,
    }
