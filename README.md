# HELLO ATS — AI Resume Analyzer

**HELLO ATS** is a full-stack AI resume analyzer that scores resumes against ATS (Applicant Tracking System) standards and target job roles. Upload a PDF, pick a role, and get instant feedback powered by Google Gemini.

| Layer | Stack |
|-------|--------|
| Frontend | React, Vite, Bootstrap (HELLO ATS dashboard) |
| Backend | Django, Django REST Framework |
| AI | Google Gemini API |
| PDF parsing | pdfplumber, PyPDF2 |
| Dev storage | Browser localStorage (users & analysis history) |

---

## Features

- PDF resume upload with validation
- AI-generated **ATS score** (0–100)
- **Skills found** and **missing skills** vs target role
- **Strengths**, **weaknesses**, and **actionable suggestions**
- User accounts (localStorage) with login / signup flow
- Dashboard sections: Analyses history, Job roles, Insights, Settings
- One-click Windows dev launcher (`start-dev.bat`)

---

## Project structure

```
AI Resume Analyzer/
├── analyzer/              # Django app (upload API, PDF extract, Gemini)
│   ├── ai_engine.py
│   ├── views.py
│   └── services/
├── backend/               # Django settings & URLs
│   ├── settings.py
│   └── .env               # GEMINI_API_KEY (not committed)
├── frontend/              # React SPA (HELLO ATS UI)
│   └── src/
├── manage.py
├── requirements.txt
├── start-dev.bat          # Windows: start backend + frontend
├── prd.md.md              # Product requirements
└── venv/
```

---

## Prerequisites

- **Python 3.10+**
- **Node.js 18+** and npm
- **Google Gemini API key** — [Google AI Studio](https://aistudio.google.com/)

---

## Quick start (Windows)

```bat
start-dev.bat
```

Opens two terminals:

| Service | URL |
|---------|-----|
| Django API | http://127.0.0.1:8000 |
| React app | http://localhost:5173 |

---

## Manual setup

### 1. Backend

```bash
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS/Linux
# source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
```

Create **`backend/.env`**:

```env
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-2.5-flash
```

```bash
python manage.py runserver
```

### 2. Frontend

```bash
cd frontend
npm install
```

Optional **`frontend/.env`**:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

```bash
npm run dev
```

### 3. Use the app

1. Open http://localhost:5173
2. **Sign up** → redirected to **Login** with success message
3. **Sign in** → Dashboard
4. Upload PDF + job role → **Run ATS analysis**

> Auth is session-in-memory only: refreshing the page returns you to Login. User accounts and analyses persist in **localStorage**.

---

## API reference

**`POST /api/upload-resume/`** — `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `resume` | file | PDF resume (max 5 MB) |
| `job_role` | string | Target job role |

**Example:**

```bash
curl -X POST http://127.0.0.1:8000/api/upload-resume/ \
  -F "resume=@resume.pdf" \
  -F "job_role=Python Developer"
```

**Success (200):**

```json
{
  "ats_score": 82,
  "skills_found": ["Python", "Django"],
  "missing_skills": ["Docker"],
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": ["..."],
  "job_role": "Python Developer",
  "resume_filename": "resume.pdf",
  "extracted_text_length": 1234,
  "status": "analysis_complete"
}
```

**Common errors:**

| Status | Meaning |
|--------|---------|
| 422 | PDF text could not be extracted |
| 429 | Gemini quota exceeded |
| 502 | AI analysis failed |
| 503 | Missing/invalid `GEMINI_API_KEY` |

---

## Production build (frontend)

```bash
cd frontend
npm run build
```

Output: `frontend/dist/` — serve via nginx, Vercel, Netlify, etc. Point `VITE_API_BASE_URL` to your deployed Django API.

---

## Deploying (Vercel + Render)

**Frontend (Vercel)** — set environment variable:

```env
VITE_API_BASE_URL=https://hello-ats-ai.onrender.com
```

**Backend (Render)** — set environment variables:

```env
DJANGO_ALLOWED_HOSTS=hello-ats-ai.onrender.com
DJANGO_DEBUG=False
GEMINI_API_KEY=your-key
GEMINI_MODEL=gemini-2.5-flash
```

CORS: settings allow `https://*.vercel.app` by default via regex. For a custom domain, add:

```env
CORS_ALLOWED_ORIGINS=https://your-production-domain.com
```

Redeploy Render after changing env vars.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| “Backend server is not running” | Run `python manage.py runserver` |
| “GEMINI_API_KEY is not configured” | Add key to `backend/.env`, restart Django |
| “Gemini API quota exceeded” | Wait or upgrade plan; try `GEMINI_MODEL=gemini-2.5-flash` |
| “Invalid PDF” | Use a text-based PDF, not image-only scans |
| **CORS blocked** (Vercel → Render) | Redeploy backend with updated `settings.py`; set `CORS_ALLOWED_ORIGINS` or rely on `*.vercel.app` regex; see below |

### CORS error explained

Browsers block JavaScript on `https://hello-ats-….vercel.app` from reading responses from `https://hello-ats-ai.onrender.com` unless the API responds with:

```http
Access-Control-Allow-Origin: https://hello-ats-….vercel.app
```

Your Django app only allowed `localhost` origins, so the browser blocked the request. `net::ERR_FAILED` often appears together with CORS because the browser hides the real response when CORS fails.

---

## Security notes

- Never commit `backend/.env` or API keys
- localStorage auth is for **development/demo only** — use real backend auth for production
- Passwords in localStorage are not encrypted

---

## License

Portfolio / educational project. See `prd.md.md` for full product scope.
