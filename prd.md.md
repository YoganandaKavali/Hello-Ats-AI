# AI Resume Analyzer – Product Requirements Document (PRD)

## Project Title
AI-Powered Resume Analyzer

---

# 1. Project Overview

The AI Resume Analyzer is a web-based application that allows users to upload their resumes and receive AI-generated feedback based on ATS (Applicant Tracking System) standards and job role requirements.

The system extracts text from resumes, analyzes skills and content using AI, and generates:
- ATS Score
- Skills identified
- Missing skills
- Strengths and weaknesses
- Improvement suggestions

The application is designed to help students and job seekers improve their resumes before applying for jobs.

---

# 2. Problem Statement

Many students and fresh graduates struggle to create industry-standard resumes. They often do not know:
- Whether their resume passes ATS systems
- Which skills are missing
- How recruiters evaluate resumes
- How to improve resume quality

This project solves that problem using AI-based resume analysis.

---

# 3. Objectives

## Primary Objective
Build an AI-powered system that analyzes resumes and provides professional feedback.

## Secondary Objectives
- Improve resume quality for students
- Help users match resumes with job roles
- Learn AI integration with full-stack development
- Build a real-world portfolio project

---

# 4. Target Users

- College students
- Fresh graduates
- Job seekers
- Internship applicants
- Beginner professionals

---

# 5. Core Features (MVP)

## 5.1 Resume Upload
Users can upload resumes in PDF format.

### Inputs
- Resume PDF
- Target Job Role

### Supported Formats
- PDF

---

## 5.2 Resume Text Extraction
The system extracts text content from uploaded resumes.

### Libraries
- pdfplumber
- PyPDF2

---

## 5.3 AI Resume Analysis
The AI engine analyzes:
- Resume structure
- Skills
- Keywords
- Experience
- ATS compatibility

---

## 5.4 ATS Score Generation
Generate a score between 0–100 based on:
- Keyword matching
- Skill relevance
- Resume formatting
- Section completeness

---

## 5.5 Skill Detection
Identify:
- Technical skills
- Tools
- Frameworks
- Databases
- Soft skills

---

## 5.6 Missing Skills Detection
Compare resume with target role requirements and identify missing skills.

### Example
Role: Python Developer

Missing Skills:
- Django
- REST APIs
- Docker

---

## 5.7 Suggestions & Improvements
Generate AI suggestions for:
- Better resume content
- Missing sections
- Skill improvements
- Formatting enhancements

---

# 6. Advanced Features (Future Scope)

- User Authentication
- Resume Analysis History
- Download Analysis Report PDF
- Resume Rewriting using AI
- Cover Letter Generator
- Job Description Matching
- AI Interview Question Generator
- Resume Comparison System

---

# 7. Functional Requirements

## Backend Requirements
- Upload resume API
- Extract resume text
- Connect with AI model
- Return JSON analysis response

## Frontend Requirements
- Resume upload form
- Result dashboard
- ATS score display
- Suggestions section

---

# 8. Non-Functional Requirements

- Fast response time
- Secure file handling
- User-friendly UI
- Responsive design
- Scalable architecture

---

# 9. Technology Stack

## Frontend
- React
- Bootstrap

## Backend
- Django
- Django REST Framework

## AI Integration
- Google Gemini API

## Database
- SQLite (initial)
- PostgreSQL/MySQL (future)

## File Processing
- pdfplumber
- PyPDF2

---

# 10. System Architecture

Frontend (React)
        ↓
Django REST API
        ↓
Resume Parser
        ↓
AI Engine (Gemini API)
        ↓
Analysis Response
        ↓
Frontend Dashboard

---

# 11. User Flow

User Opens Website
        ↓
Uploads Resume PDF
        ↓
Selects Job Role
        ↓
Resume Text Extracted
        ↓
AI Processes Resume
        ↓
Analysis Generated
        ↓
Results Displayed

---

# 12. API Design

## Upload Resume API

### Endpoint
POST /api/upload-resume/

### Request
- Resume file
- Job role

### Response
```json
{
  "ats_score": 82,
  "skills_found": [
    "Python",
    "React",
    "SQL"
  ],
  "missing_skills": [
    "Docker",
    "AWS"
  ],
  "strengths": [
    "Good frontend skills"
  ],
  "weaknesses": [
    "No cloud experience"
  ],
  "suggestions": [
    "Add Django project experience"
  ]
}
```

---

# 13. Database Design (Future)

## User Table
- id
- username
- email
- password

## Resume Analysis Table
- id
- user_id
- resume_name
- ats_score
- analysis_date

---

# 14. UI Pages

## Home Page
- Upload Resume
- Enter Job Role

## Results Page
- ATS Score Card
- Skills Found
- Missing Skills
- Suggestions

## Login/Register Page (Future)

---

# 15. Security Considerations

- Validate uploaded files
- Restrict unsupported formats
- Secure API keys
- Prevent large file uploads

---

# 16. Challenges

- Accurate resume parsing
- AI response consistency
- ATS scoring logic
- Prompt optimization

---

# 17. Expected Outcomes

The project should:
- Analyze resumes effectively
- Provide meaningful suggestions
- Help users improve employability
- Demonstrate AI + full-stack integration skills

---

# 18. Future Enhancements

- Multi-language support
- Resume templates
- LinkedIn profile analysis
- AI career guidance
- Voice-based interview practice

---

# 19. Conclusion

The AI Resume Analyzer is a real-world AI-powered application that combines:
- Full-stack development
- Artificial Intelligence
- File handling
- REST APIs
- Resume analytics

The project provides practical value to students and job seekers while showcasing modern software development skills.

