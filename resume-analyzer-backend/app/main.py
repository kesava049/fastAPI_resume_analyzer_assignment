# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints import router as api_router
from app.db.database import engine, Base

# This creates the database tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Resume Analyzer API")

# Allow your React frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Be more specific in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routes from endpoints.py
app.include_router(api_router, prefix="/api/resume", tags=["Resume"])

@app.get("/", tags=["Health Check"])
def read_root():
    return {"status": "ok", "message": "Welcome to the Resume Analyzer API!"}