import { getAnalysesForUser } from "./analysisStorage";

const DEFAULT_ROLES = [
  "Python Developer",
  "Full Stack Developer",
  "Data Analyst",
  "Frontend Developer",
  "DevOps Engineer",
  "Product Manager",
  "Machine Learning Engineer",
  "UI/UX Designer",
];

export function getJobRolesForUser(userId) {
  const analyses = getAnalysesForUser(userId);
  const fromHistory = analyses.map((a) => a.job_role).filter(Boolean);
  const unique = [...new Set([...fromHistory, ...DEFAULT_ROLES])];
  return unique.sort((a, b) => a.localeCompare(b));
}

export function getRoleStats(userId) {
  const analyses = getAnalysesForUser(userId);
  const stats = {};

  analyses.forEach((a) => {
    if (!stats[a.job_role]) {
      stats[a.job_role] = { count: 0, totalScore: 0, lastDate: a.date };
    }
    stats[a.job_role].count += 1;
    stats[a.job_role].totalScore += a.ats_score;
    if (new Date(a.date) > new Date(stats[a.job_role].lastDate)) {
      stats[a.job_role].lastDate = a.date;
    }
  });

  return Object.entries(stats)
    .map(([role, data]) => ({
      role,
      count: data.count,
      avgScore: Math.round(data.totalScore / data.count),
      lastDate: data.lastDate,
    }))
    .sort((a, b) => b.count - a.count);
}
