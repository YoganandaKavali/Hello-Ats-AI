const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export function validateEmail(email) {
  const value = (email || "").trim();
  if (!value) return "Email is required.";
  if (!EMAIL_REGEX.test(value)) return "Enter a valid email address.";
  return "";
}

export function validatePassword(password, { minLength = 6, required = true } = {}) {
  if (!password) return required ? "Password is required." : "";
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters.`;
  }
  return "";
}

export function validateName(name) {
  const value = (name || "").trim();
  if (!value) return "Full name is required.";
  if (value.length < 2) return "Name must be at least 2 characters.";
  if (value.length > 80) return "Name must be 80 characters or fewer.";
  return "";
}

export function validateJobRole(jobRole) {
  const value = (jobRole || "").trim();
  if (!value) return "Target job role is required.";
  if (value.length < 2) return "Job role must be at least 2 characters.";
  if (value.length > 120) return "Job role must be 120 characters or fewer.";
  return "";
}

export async function validateResumeFile(file) {
  if (!file) return "Please select a PDF resume to upload.";

  const name = (file.name || "").toLowerCase();
  if (!name.endsWith(".pdf")) {
    return "Invalid file type. Only PDF resumes are supported.";
  }

  if (file.type && file.type !== "application/pdf") {
    return "Invalid file type. Only PDF resumes are supported.";
  }

  if (file.size > MAX_RESUME_BYTES) {
    return "Resume file must be 5 MB or smaller.";
  }

  if (file.size < 100) {
    return "File is too small or empty. Upload a valid PDF resume.";
  }

  try {
    const header = await file.slice(0, 5).arrayBuffer();
    const bytes = new Uint8Array(header);
    const magic = String.fromCharCode(...bytes);
    if (!magic.startsWith("%PDF")) {
      return "Invalid PDF file. The document does not appear to be a valid PDF.";
    }
  } catch {
    return "Could not read the file. Try uploading again.";
  }

  return "";
}

export function validateLoginForm({ email, password }) {
  const errors = {};
  const emailErr = validateEmail(email);
  const passwordErr = validatePassword(password);
  if (emailErr) errors.email = emailErr;
  if (passwordErr) errors.password = passwordErr;
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateSignupForm({ name, email, password }) {
  const errors = {};
  const nameErr = validateName(name);
  const emailErr = validateEmail(email);
  const passwordErr = validatePassword(password, { minLength: 6 });
  if (nameErr) errors.name = nameErr;
  if (emailErr) errors.email = emailErr;
  if (passwordErr) errors.password = passwordErr;
  return { valid: Object.keys(errors).length === 0, errors };
}

export async function validateUploadForm({ file, jobRole }) {
  const errors = {};
  const fileErr = await validateResumeFile(file);
  const roleErr = validateJobRole(jobRole);
  if (fileErr) errors.resume = fileErr;
  if (roleErr) errors.job_role = roleErr;
  return { valid: Object.keys(errors).length === 0, errors };
}
