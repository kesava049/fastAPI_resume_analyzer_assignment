# app/db/schemas.py
from pydantic import BaseModel
from typing import Optional, List, Any
import datetime

class ResumeBase(BaseModel):
    filename: str
    rating: Optional[int] = None

class ResumeCreate(ResumeBase):
    raw_text: Optional[str] = None
    analysis: Optional[dict] = None

class Resume(ResumeBase):
    id: int
    created_at: datetime.datetime
    analysis: Optional[Any] = None

    class Config:
        # This is the updated setting
        from_attributes = True

class ResumeSummary(BaseModel):
    id: int
    filename: str
    created_at: datetime.datetime
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

    class Config:
        # This is the updated setting
        from_attributes = True