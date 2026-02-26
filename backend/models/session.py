from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class SessionStatus(str, Enum):
    active = "active"
    completed = "completed"


class SessionStart(BaseModel):
    role: str = Field(..., example="Frontend Engineer")
    level: str = Field(..., example="senior")
    rounds: List[str] = Field(..., example=["technical", "behavioral"])
    job_description: str = Field(..., min_length=10)
    # resume_text comes from the uploaded PDF, not the request body


class SessionOut(BaseModel):
    id: str
    user_id: str
    role: str
    level: str
    rounds: List[str]
    status: SessionStatus
    created_at: datetime
    completed_at: Optional[datetime] = None
    overall_score: Optional[float] = None
    category_scores: Optional[Dict[str, float]] = None
    question_count: int = 0


class SessionListItem(BaseModel):
    id: str
    role: str
    level: str
    rounds: List[str]
    status: SessionStatus
    created_at: datetime
    overall_score: Optional[float] = None
    question_count: int = 0
