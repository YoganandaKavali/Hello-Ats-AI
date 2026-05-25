"""Custom exceptions for resume AI analysis."""


class AIEngineConfigurationError(Exception):
    """Raised when the AI engine is missing required configuration (e.g. API key)."""


class AIEngineAnalysisError(Exception):
    """Raised when Gemini fails or returns an invalid analysis payload."""
