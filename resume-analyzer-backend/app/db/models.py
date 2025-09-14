# app/db/models.py
import datetime
from sqlalchemy import Column, Integer, String, DateTime, JSON, Text
from .database import Base

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    raw_text = Column(Text, nullable=True)
    analysis = Column(JSON, nullable=True)
    rating = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)