# Full-Stack AI Resume Analyzer

This is a full-stack web application designed to help users improve their resumes. It allows users to upload a PDF resume, receive a detailed analysis powered by the Google Gemini LLM, and view a history of all past analyses.

## Features

-   **Live AI-Powered Analysis**: Upload a PDF resume and get instant, structured feedback.
-   **Detailed Data Extraction**: Parses and categorizes information into Personal Details, Work Experience, Education, Projects, and Skills.
-   **Actionable Feedback**: Provides a 1-10 rating, highlights specific areas for improvement, and suggests relevant skills to learn.
-   **Historical Viewer**: Browse and view all previously analyzed resumes in a clean table.
-   **Reusable UI Components**: A modal view in the history tab reuses the analysis report component for a consistent user experience.

---

## Screenshots

The application interface is clean, intuitive, and user-friendly.

1.  Resume Upload & Analysis Tab
2.  Analysis Report View
3.  History Tab with All Records
4.  Details Modal

---

## Tech Stack

-   **Frontend**: React.js
-   **Backend**: Python, FastAPI
-   **Database**: PostgreSQL
-   **ORM**: SQLAlchemy
-   **AI / LLM**: Google Gemini
-   **Server**: Uvicorn
-   **File Parsing**: PyPDF

---

## Local Setup and Installation

Follow these instructions to get the project running on your local machine.

### Prerequisites

-   **Python (v3.8 or later)**
-   **A running PostgreSQL database instance**
-   Node.js (v18 or later) for the frontend
-   npm or yarn

### 1. Clone the Repository

```bash
git clone [https://github.com/kesava049/fastAPI_resume_analyzer_assignment.git]
cd Resume_Analyzer
```

### 2. Backend Setup (FastAPI)

Navigate to the backend directory and follow these steps:

```bash
cd resume-analyzer-backend
```

#### a. Create and Activate a Virtual Environment

It's a best practice to use a virtual environment to manage project dependencies.

```bash
# Create the environment
In windows
python -m venv venv
In MacOs
python3 -m venv venv

# Activate it
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

#### b. Install Dependencies

Install all the required Python packages from the `requirements.txt` file.

```bash
pip install -r requirements.txt
```

#### c. Set Up Environment Variables

Create a `.env` file in the `/backend` directory. This file is crucial for storing your database connection string and API key.

```ini
# .env

# Your PostgreSQL connection string from a provider like NeonDB
# Example: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Your Google Gemini API Key
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

#### d. Database Setup

The database tables are created automatically when you first start the server, based on the models defined with SQLAlchemy. For production environments, a migration tool like [Alembic](https://alembic.sqlalchemy.org/en/latest/) would be recommended.

#### e. Start the Backend Server

```bash
uvicorn app.main:app --reload
```

The backend server will be running on **`http://12.0.0.1:8000`**. You can view the interactive API documentation at **`http://127.0.0.1:8000/docs`**.

### 3. Frontend Setup

Open a **new terminal**, navigate to the frontend directory, and follow these steps:

```bash
cd frontend
```

#### a. Install Dependencies

```bash
npm install
```

#### b. Start the Frontend Development Server

```bash
npm run dev
```

The frontend application will be accessible at **`http://localhost:5173`**.

---

## Project Structure

The project is organized into separate frontend and backend directories to maintain a clean separation of concerns.

```
/resume-analyzer
|
|-- /backend
|   |-- /app
|   |   |-- /api             # API Endpoints (FastAPI Router)
|   |   |-- /core            # Configuration (settings)
|   |   |-- /db              # Database models, schemas, and session
|   |   |-- /services        # Gemini LLM service
|   |   |-- main.py          # Main FastAPI application instance
|   |-- .env                 # Environment variables (MUST BE CREATED)
|   |-- requirements.txt     # Python dependencies
|
|-- /frontend
|   |-- /src
|   |   |-- /components      # Reusable React components
|   |   |-- App.jsx
|   |   |-- index.js
|   |-- package.json
|
|-- /sample_data             # Sample PDFs for testing
|-- /screenshots             # UI screenshots
```

---

## Testing

The `/sample_data` directory contains several resume PDFs that can be used to test the application's upload and analysis functionality.
The `/screenshots` directory contains the screenshots of the assignment.