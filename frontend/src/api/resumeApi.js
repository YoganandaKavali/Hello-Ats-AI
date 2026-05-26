const API_BASE_URL = "https://hello-ats-ai.onrender.com";
/**
 * Upload resume PDF and target job role for AI analysis.
 * @param {File} resumeFile
 * @param {string} jobRole
 * @returns {Promise<object>}
 */
export async function uploadResume(resumeFile, jobRole) {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("job_role", jobRole.trim());

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/upload-resume/`, {
      method: "POST",
      body: formData,
    });
  } catch (networkError) {
    const error = new Error("Failed to fetch");
    error.cause = networkError;
    error.code = "NETWORK_ERROR";
    throw error;
  }

  let data = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = text ? { detail: text } : null;
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.resume?.[0] ||
      data?.job_role?.[0] ||
      `Request failed (${response.status})`;
    const error = new Error(
      typeof message === "string" ? message : JSON.stringify(message)
    );
    error.status = response.status;
    error.data = data;
    error.code = `HTTP_${response.status}`;
    throw error;
  }

  return data;
}
