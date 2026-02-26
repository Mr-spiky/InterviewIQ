from fastapi import APIRouter, HTTPException, Depends, Body
from datetime import datetime
from bson import ObjectId
from typing import Optional

from db.mongo import get_db
from models.message import MessageIn, MessageOut, AITurnOut
from utils.auth import get_current_user
from services.gemini import get_next_interview_turn

router = APIRouter(prefix="/interview", tags=["interview"])


@router.post("/message", response_model=AITurnOut)
async def send_message(
    data: MessageIn,
    user_id: str = Depends(get_current_user),
):
    db = get_db()

    # Verify session belongs to user
    session = await db["sessions"].find_one({
        "_id": ObjectId(data.session_id),
        "user_id": user_id,
        "status": "active",
    })
    if not session:
        raise HTTPException(status_code=404, detail="Active session not found")

    # Persist user message — store _id for score update later
    user_msg_doc = {
        "session_id": data.session_id,
        "role": "user",
        "content": data.content,
        "score": None,
        "feedback": None,
        "weak_points": [],
        "timestamp": datetime.utcnow(),
    }
    user_insert = await db["messages"].insert_one(user_msg_doc)
    user_msg_id = user_insert.inserted_id

    # Fetch full conversation history (for Gemini context)
    history_cursor = db["messages"].find(
        {"session_id": data.session_id},
        sort=[("timestamp", 1)]
    )
    history = []
    async for msg in history_cursor:
        history.append({"role": msg["role"], "content": msg["content"]})

    # Call Gemini AI
    question_count = session.get("question_count", 0)
    ai_result = await get_next_interview_turn(
        role=session["role"],
        level=session["level"],
        current_round=session.get("current_round", session["rounds"][0]),
        resume_text=session.get("resume_text", ""),
        job_description=session.get("job_description", ""),
        history=history,
        question_count=question_count,
    )

    # Update score on the user's message by _id (no invalid sort param)
    await db["messages"].update_one(
        {"_id": user_msg_id},
        {"$set": {
            "score": ai_result.get("score"),
            "feedback": ai_result.get("feedback"),
            "weak_points": ai_result.get("weak_points", []),
        }}
    )

    # Persist AI reply
    ai_msg_doc = {
        "session_id": data.session_id,
        "role": "ai",
        "content": ai_result["reply"],
        "timestamp": datetime.utcnow(),
    }
    ai_result_id = await db["messages"].insert_one(ai_msg_doc)

    # Increment question count (only if not a follow-up)
    new_count = question_count + (0 if ai_result.get("is_follow_up") else 1)
    await db["sessions"].update_one(
        {"_id": ObjectId(data.session_id)},
        {"$set": {"question_count": new_count}}
    )

    return AITurnOut(
        message=MessageOut(
            id=str(ai_result_id.inserted_id),
            session_id=data.session_id,
            role="ai",
            content=ai_result["reply"],
            timestamp=ai_msg_doc["timestamp"],
        ),
        score=ai_result.get("score"),
        feedback=ai_result.get("feedback"),
        weak_points=ai_result.get("weak_points", []),
        is_follow_up=ai_result.get("is_follow_up", False),
        question_count=new_count,
    )


@router.post("/end/{session_id}")
async def end_session(
    session_id: str,
    user_id: str = Depends(get_current_user),
):
    db = get_db()
    session = await db["sessions"].find_one({
        "_id": ObjectId(session_id),
        "user_id": user_id,
    })
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    await db["sessions"].update_one(
        {"_id": ObjectId(session_id)},
        {"$set": {"status": "completed", "completed_at": datetime.utcnow()}}
    )
    return {"message": "Session ended", "session_id": session_id}
