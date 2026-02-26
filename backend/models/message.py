from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class MessageIn(BaseModel):
    session_id: str
    content: str = Field(..., min_length=1, max_length=5000)


class MessageOut(BaseModel):
    id: str
    session_id: str
    role: str  # "ai" | "user"
    content: str
    score: Optional[float] = None
    feedback: Optional[str] = None
    weak_points: Optional[List[str]] = None
    timestamp: datetime


class AITurnOut(BaseModel):
    """What the frontend receives after sending a user answer."""
    message: MessageOut        # the AI's reply message
    score: Optional[float]     # score for the USER's last answer (1-10)
    feedback: Optional[str]    # one-line feedback on the answer
    weak_points: Optional[List[str]]
    is_follow_up: bool = False
    question_count: int
