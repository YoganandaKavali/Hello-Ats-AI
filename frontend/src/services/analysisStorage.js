import { STORAGE_KEYS } from "../utils/storageKeys";

function readAllAnalyses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANALYSES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAllAnalyses(analyses) {
  localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(analyses));
}

/**
 * Persist a successful analysis for the logged-in user.
 */
export function saveAnalysis(userId, apiResult) {
  const record = {
    id: crypto.randomUUID(),
    userId,
    filename: apiResult.resume_filename,
    job_role: apiResult.job_role,
    ats_score: apiResult.ats_score,
    date: new Date().toISOString(),
    skills_found: apiResult.skills_found ?? [],
    missing_skills: apiResult.missing_skills ?? [],
    strengths: apiResult.strengths ?? [],
    weaknesses: apiResult.weaknesses ?? [],
    suggestions: apiResult.suggestions ?? [],
    extracted_text_length: apiResult.extracted_text_length,
    status: apiResult.status,
  };

  const all = readAllAnalyses();
  all.unshift(record);
  writeAllAnalyses(all);

  return record;
}

export function getAnalysesForUser(userId) {
  return readAllAnalyses()
    .filter((a) => a.userId === userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getAnalysisById(userId, analysisId) {
  return getAnalysesForUser(userId).find((a) => a.id === analysisId) ?? null;
}

export function deleteAnalysis(userId, analysisId) {
  const all = readAllAnalyses();
  const next = all.filter((a) => !(a.id === analysisId && a.userId === userId));
  writeAllAnalyses(next);
}
