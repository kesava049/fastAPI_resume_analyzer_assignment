# app/services/gemini_service.py
import google.generativeai as genai
import json
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

RESUME_PROMPT_TEMPLATE = """
You are a highly skilled resume analysis expert for a top-tier tech recruiting firm.
Your task is to meticulously analyze the provided resume text and extract key information into a structured JSON format.
Additionally, you must provide a critical evaluation, a rating, and actionable suggestions for improvement and upskilling.

Resume Text:
---
{resume_text}
---

Return a single, valid JSON object with the following structure. Do not include any text or formatting outside of the JSON object.

{{
  "personalDetails": {{
    "name": "string or null", "email": "string or null", "phone": "string or null",
    "linkedinUrl": "string or null", "portfolioUrl": "string or null", "githubUrl": "string or null", "location": "string or null"
  }},
  "resumeContent": {{
    "summaryObjective": "string",
    "workExperience": [{{ "title": "string", "company": "string", "dates": "string", "description": "string" }}],
    "education": [{{ "degree": "string", "institution": "string", "dates": "string", "details": "string or null" }}],
    "projects": [{{ "name": "string", "description": "string", "technologies": "string or array of strings" }}],
    "certifications": ["string"]
  }},
  "skills": {{
    "technicalSkills": ["string"], "softSkills": ["string"], "otherSkills": ["string"]
  }},
  "aiFeedback": {{
    "rating": "A single integer from 1 to 10, where 10 is outstanding.",
    "overallAssessment": "A concise, 2-3 sentence summary of the resume's strengths and weaknesses.",
    "improvementAreas": ["Provide 3-5 specific, actionable points to improve the resume. Focus on clarity, impact metrics, and formatting."],
    "suggestedSkillsToLearn": ["Based on the candidate's current skills and experience, suggest 3-5 relevant and in-demand technologies or methodologies to learn for career progression."]
  }}
}}

Ensure all fields are present. If information for a field is not found, use an appropriate empty value (e.g., "", [], or null).
"""

async def analyze_resume_text(resume_text: str) -> dict:
    try:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={"response_mime_type": "application/json"}
        )
        prompt = RESUME_PROMPT_TEMPLATE.format(resume_text=resume_text)
        response = await model.generate_content_async(prompt)
        return json.loads(response.text)
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        raise ValueError("Failed to analyze resume with AI.") from e