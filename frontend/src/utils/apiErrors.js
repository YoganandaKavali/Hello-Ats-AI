/**
 * Map API/network errors to user-friendly messages.
 */
export function getApiErrorMessage(error) {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  const message = error.message || "";
  const status = error.status;
  const detail =
    typeof error.data?.detail === "string"
      ? error.data.detail
      : "";

  // Backend unreachable
  if (
    message === "Failed to fetch" ||
    error.name === "TypeError" ||
    message.includes("NetworkError") ||
    message.includes("Load failed")
  ) {
    const isLocal =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");
    if (isLocal) {
      return "Backend server is not running. Start Django with: python manage.py runserver (http://127.0.0.1:8000)";
    }
    return "Cannot reach the API server. Check that Render is running at https://hello-ats-ai.onrender.com and redeploy the frontend with VITE_API_BASE_URL set.";
  }

  // Gemini quota / rate limit
  if (
    status === 429 ||
    detail.toLowerCase().includes("quota") ||
    message.toLowerCase().includes("quota")
  ) {
    return "Gemini API quota exceeded. Wait a moment and retry, or check your API plan and billing in Google AI Studio.";
  }

  // Gemini / AI configuration
  if (status === 503 || detail.toLowerCase().includes("gemini_api_key")) {
    return "AI service is not configured. Add GEMINI_API_KEY to backend/.env and restart the Django server.";
  }

  // AI analysis failures
  if (status === 502) {
    if (detail) return detail;
    return "AI analysis failed. Please try again in a few seconds.";
  }

  // Invalid PDF / extraction (422)
  if (status === 422) {
    if (detail.toLowerCase().includes("extract") || detail.toLowerCase().includes("pdf")) {
      return "Invalid or unreadable PDF. Upload a text-based PDF resume (not a scanned image-only file).";
    }
    return detail || "Could not process the PDF resume.";
  }

  // Serializer validation from backend
  if (error.data?.resume?.[0]) {
    const resumeErr = error.data.resume[0];
    if (resumeErr.toLowerCase().includes("pdf")) {
      return "Invalid PDF file. " + resumeErr;
    }
    return resumeErr;
  }

  if (error.data?.job_role?.[0]) {
    return error.data.job_role[0];
  }

  if (detail) return detail;

  if (status === 500) {
    return "Server error. Check the Django terminal for details and try again.";
  }

  return message || "Request failed. Please try again.";
}
