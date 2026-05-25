"""Resume PDF text extraction (PRD §5.2)."""

from __future__ import annotations

import io
import logging

import pdfplumber
from PyPDF2 import PdfReader

logger = logging.getLogger(__name__)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract plain text from a PDF resume.

    Uses pdfplumber as the primary extractor and falls back to PyPDF2
    when pdfplumber returns empty text (e.g. scanned PDFs with limited OCR).
    """
    text = _extract_with_pdfplumber(file_bytes)
    if text.strip():
        return _normalize_text(text)

    text = _extract_with_pypdf2(file_bytes)
    return _normalize_text(text)


def _extract_with_pdfplumber(file_bytes: bytes) -> str:
    chunks: list[str] = []
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    chunks.append(page_text)
    except Exception:
        logger.exception("pdfplumber failed to extract resume text")
        return ""
    return "\n".join(chunks)


def _extract_with_pypdf2(file_bytes: bytes) -> str:
    chunks: list[str] = []
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                chunks.append(page_text)
    except Exception:
        logger.exception("PyPDF2 failed to extract resume text")
        return ""
    return "\n".join(chunks)


def _normalize_text(text: str) -> str:
    """Collapse excessive whitespace while preserving line breaks."""
    lines = [line.strip() for line in text.splitlines()]
    return "\n".join(line for line in lines if line)
