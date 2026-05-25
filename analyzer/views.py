"""API views for resume upload and analysis."""

import logging

from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from analyzer.ai_engine import analyze_resume
from analyzer.exceptions import AIEngineAnalysisError, AIEngineConfigurationError
from analyzer.serializers import ResumeUploadSerializer
from analyzer.services.pdf_extractor import extract_text_from_pdf

logger = logging.getLogger(__name__)


class ResumeUploadView(APIView):
    """
    POST /api/upload-resume/

    Accepts a PDF resume and target job role, extracts text, runs Gemini
    analysis, and returns a structured JSON payload (PRD §12).
    """

    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = ResumeUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        resume_file = serializer.validated_data["resume"]
        job_role = serializer.validated_data["job_role"]

        file_bytes = resume_file.read()
        extracted_text = extract_text_from_pdf(file_bytes)

        if not extracted_text.strip():
            return Response(
                {
                    "detail": (
                        "Could not extract text from the PDF. "
                        "Please upload a text-based PDF resume."
                    )
                },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        try:
            analysis = analyze_resume(extracted_text, job_role)
        except AIEngineConfigurationError as exc:
            logger.error("AI engine configuration error: %s", exc)
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except AIEngineAnalysisError as exc:
            logger.warning("AI analysis failed: %s", exc)
            status_code = status.HTTP_502_BAD_GATEWAY
            if "quota" in str(exc).lower():
                status_code = status.HTTP_429_TOO_MANY_REQUESTS
            return Response(
                {"detail": str(exc)},
                status=status_code,
            )
        except Exception:
            logger.exception("Unexpected error during resume analysis")
            return Response(
                {
                    "detail": (
                        "An unexpected error occurred while analyzing the resume. "
                        "Please try again later."
                    )
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        response_data = {
            **analysis,
            "job_role": job_role,
            "resume_filename": resume_file.name,
            "extracted_text_length": len(extracted_text),
            "status": "analysis_complete",
        }

        return Response(response_data, status=status.HTTP_200_OK)
