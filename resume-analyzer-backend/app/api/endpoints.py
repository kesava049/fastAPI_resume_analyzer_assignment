# app/api/endpoints.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import pypdf
import io

from app.db import models, schemas
from app.db.database import get_db
from app.services import gemini_service

router = APIRouter()

@router.post("/upload", response_model=schemas.Resume)
async def upload_and_analyze_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    try:
        pdf_contents = await file.read()
        reader = pypdf.PdfReader(io.BytesIO(pdf_contents))
        raw_text = "".join(page.extract_text() for page in reader.pages)
        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

        analysis_json = await gemini_service.analyze_resume_text(raw_text)
        rating = analysis_json.get("aiFeedback", {}).get("rating")

        new_resume = models.Resume(
            filename=file.filename,
            raw_text=raw_text,
            analysis=analysis_json,
            rating=rating
        )
        db.add(new_resume)
        db.commit()
        db.refresh(new_resume)
        return new_resume
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@router.get("/", response_model=List[schemas.ResumeSummary])
def list_all_resumes(db: Session = Depends(get_db)):
    resumes = db.query(models.Resume).order_by(models.Resume.created_at.desc()).all()
    summary_list = []
    for res in resumes:
        details = res.analysis.get("personalDetails", {})
        summary_list.append(
            schemas.ResumeSummary(
                id=res.id,
                filename=res.filename,
                created_at=res.created_at,
                name=details.get("name"),
                email=details.get("email"),
                phone=details.get("phone")
            )
        )
    return summary_list

@router.get("/{resume_id}", response_model=schemas.Resume)
def get_resume_details(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if resume is None:
        raise HTTPException(status_code=404, detail="Resume not found.")
    return resume