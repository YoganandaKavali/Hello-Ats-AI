"""
Google Gemini integration for resume ATS analysis (PRD §5.3–§5.7).
"""

from __future__ import annotations

import json
import logging
import re
from typing import Any

import google.generativeai as genai
from django.conf import settings
from google.api_core import exceptions as google_exceptions

from analyzer.exceptions import AIEngineAnalysisError, AIEngineConfigurationError

logger = logging.getLogger(__name__)

ANALYSIS_FIELDS = (
    "ats_score",
    "skills_found",
    "missing_skills",
    "strengths",
    "weaknesses",
    "suggestions",
)

LIST_FIELDS = (
    "skills_found",
    "missing_skills",
    "strengths",
    "weaknesses",
    "suggestions",
)

ANALYSIS_PROMPT = """You are an expert ATS (Applicant Tracking System) resume analyst and career coach.

Analyze the resume text below for the target job role: "{target_role}".

Evaluate:
- ATS compatibility (keywords, structure, section completeness, formatting signals)
- Technical and soft skills present in the resume
- Skills missing compared to typical requirements for the role
- Strengths and weaknesses relative to the target role
- Concrete, actionable improvement suggestions

Return ONLY valid JSON with this exact schema (no markdown, no extra keys):
{{
  "ats_score": <integer 0-100>,
  "skills_found": [<strings>],
  "missing_skills": [<strings>],
  "strengths": [<strings>],
  "weaknesses": [<strings>],
  "suggestions": [<strings>]
}}

Rules:
- ats_score must reflect realistic ATS fit for "{target_role}"
- skills_found: skills explicitly supported by resume content
- missing_skills: important skills for the role not evidenced in the resume
- Each list item should be a short, clear phrase
- Provide at least 2 items per list when possible
- suggestions must be specific and actionable

--- RESUME TEXT ---
{resume_text}
"""


def analyze_resume(resume_text: str, target_role: str) -> dict[str, Any]:
    """
    Analyze resume text for a target job role using Google Gemini.

    Returns a dict with: ats_score, skills_found, missing_skills,
    strengths, weaknesses, suggestions.
    """
    if not resume_text or not resume_text.strip():
        raise AIEngineAnalysisError("Resume text is empty; nothing to analyze.")

    if not target_role or not target_role.strip():
        raise AIEngineAnalysisError("Target job role is required for analysis.")

    api_key = (getattr(settings, "GEMINI_API_KEY", None) or "").strip()
    if not api_key:
        raise AIEngineConfigurationError(
            "GEMINI_API_KEY is not configured. Add it to backend/.env."
        )

    truncated_text = _truncate_resume_text(resume_text)
    prompt = ANALYSIS_PROMPT.format(
        target_role=target_role.strip(),
        resume_text=truncated_text,
    )

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(
            model_name=settings.GEMINI_MODEL,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.3,
            ),
        )
        response = model.generate_content(prompt)
    except AIEngineConfigurationError:
        raise
    except google_exceptions.ResourceExhausted as exc:
        logger.warning("Gemini API quota exceeded: %s", exc)
        raise AIEngineAnalysisError(
            "AI analysis quota exceeded. Please wait and try again, "
            "or check your Gemini API plan and billing."
        ) from exc
    except google_exceptions.InvalidArgument as exc:
        logger.error("Gemini API invalid request (model=%s): %s", settings.GEMINI_MODEL, exc)
        raise AIEngineAnalysisError(
            f"AI model configuration error. Check GEMINI_MODEL "
            f"({settings.GEMINI_MODEL!r}) in backend/.env."
        ) from exc
    except google_exceptions.PermissionDenied as exc:
        logger.error("Gemini API permission denied: %s", exc)
        raise AIEngineConfigurationError(
            "Gemini API key is invalid or lacks permission. "
            "Verify GEMINI_API_KEY in backend/.env."
        ) from exc
    except google_exceptions.GoogleAPIError as exc:
        logger.exception("Gemini API request failed")
        raise AIEngineAnalysisError(
            "AI analysis service is temporarily unavailable. Please try again."
        ) from exc
    except Exception as exc:
        logger.exception("Unexpected error calling Gemini API")
        raise AIEngineAnalysisError(
            "AI analysis service is temporarily unavailable. Please try again."
        ) from exc

    raw_text = getattr(response, "text", None) or ""
    if not raw_text.strip():
        raise AIEngineAnalysisError("AI returned an empty response.")

    try:
        payload = _parse_json_response(raw_text)
        return _normalize_analysis(payload)
    except AIEngineAnalysisError:
        raise
    except Exception as exc:
        logger.exception("Failed to parse Gemini analysis response")
        raise AIEngineAnalysisError(
            "AI returned an invalid analysis format. Please try again."
        ) from exc


def _truncate_resume_text(text: str) -> str:
    max_chars = getattr(settings, "MAX_RESUME_TEXT_CHARS", 30000)
    cleaned = text.strip()
    if len(cleaned) <= max_chars:
        return cleaned
    return cleaned[:max_chars] + "\n\n[Resume text truncated for analysis.]"


def _parse_json_response(raw_text: str) -> dict[str, Any]:
    text = raw_text.strip()

    # Strip markdown code fences if the model wraps JSON
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
    if fence_match:
        text = fence_match.group(1).strip()

    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        raise AIEngineAnalysisError("AI response was not valid JSON.") from exc

    if not isinstance(data, dict):
        raise AIEngineAnalysisError("AI response must be a JSON object.")

    return data


def _normalize_analysis(data: dict[str, Any]) -> dict[str, Any]:
    missing = [field for field in ANALYSIS_FIELDS if field not in data]
    if missing:
        raise AIEngineAnalysisError(
            f"AI response missing required fields: {', '.join(missing)}"
        )

    try:
        ats_score = int(data["ats_score"])
    except (TypeError, ValueError) as exc:
        raise AIEngineAnalysisError("ats_score must be an integer.") from exc

    ats_score = max(0, min(100, ats_score))

    normalized: dict[str, Any] = {"ats_score": ats_score}

    for field in LIST_FIELDS:
        value = data[field]
        if not isinstance(value, list):
            raise AIEngineAnalysisError(f"{field} must be a list.")
        normalized[field] = [
            str(item).strip() for item in value if str(item).strip()
        ]

    return normalized
