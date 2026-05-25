"""DRF serializers for resume upload and analysis responses."""

from django.conf import settings
from rest_framework import serializers

from analyzer.constants import (
    JOB_ROLE_FIELD_NAME,
    MAX_JOB_ROLE_LENGTH,
    MIN_JOB_ROLE_LENGTH,
    RESUME_FIELD_NAME,
)


class ResumeUploadSerializer(serializers.Serializer):
    """Validates PDF resume upload and target job role (PRD §5.1)."""

    resume = serializers.FileField(
        help_text="Resume file in PDF format.",
    )
    job_role = serializers.CharField(
        max_length=MAX_JOB_ROLE_LENGTH,
        trim_whitespace=True,
        help_text="Target job role for resume analysis.",
    )

    def validate_resume(self, uploaded_file):
        if uploaded_file.size > settings.MAX_RESUME_UPLOAD_SIZE_BYTES:
            max_mb = settings.MAX_RESUME_UPLOAD_SIZE_MB
            raise serializers.ValidationError(
                f"Resume file must not exceed {max_mb} MB."
            )

        content_type = getattr(uploaded_file, "content_type", "") or ""
        if content_type and content_type not in settings.ALLOWED_RESUME_CONTENT_TYPES:
            raise serializers.ValidationError("Only PDF resume files are allowed.")

        name = (uploaded_file.name or "").lower()
        if not name.endswith(settings.ALLOWED_RESUME_EXTENSIONS):
            raise serializers.ValidationError("Resume must be a .pdf file.")

        # Verify PDF magic bytes (%PDF)
        header = uploaded_file.read(5)
        uploaded_file.seek(0)
        if not header.startswith(b"%PDF"):
            raise serializers.ValidationError("Uploaded file is not a valid PDF.")

        return uploaded_file

    def validate_job_role(self, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < MIN_JOB_ROLE_LENGTH:
            raise serializers.ValidationError(
                f"Job role must be at least {MIN_JOB_ROLE_LENGTH} characters."
            )
        return cleaned


class ResumeAnalysisResponseSerializer(serializers.Serializer):
    """Response shape aligned with PRD §12."""

    ats_score = serializers.IntegerField(min_value=0, max_value=100)
    skills_found = serializers.ListField(child=serializers.CharField())
    missing_skills = serializers.ListField(child=serializers.CharField())
    strengths = serializers.ListField(child=serializers.CharField())
    weaknesses = serializers.ListField(child=serializers.CharField())
    suggestions = serializers.ListField(child=serializers.CharField())
    job_role = serializers.CharField()
    resume_filename = serializers.CharField()
    extracted_text_length = serializers.IntegerField()
    status = serializers.CharField()
