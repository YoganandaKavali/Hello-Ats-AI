import { getAnalysesForUser } from "./analysisStorage";

export function getInsightsForUser(userId) {
  const analyses = getAnalysesForUser(userId);

  if (!analyses.length) {
    return {
      totalAnalyses: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      topMissingSkills: [],
      scoreByMonth: [],
      recentTrend: [],
    };
  }

  const scores = analyses.map((a) => a.ats_score);
  const averageScore = Math.round(
    scores.reduce((sum, s) => sum + s, 0) / scores.length
  );

  const skillCount = {};
  analyses.forEach((a) => {
    (a.missing_skills || []).forEach((skill) => {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
  });

  const topMissingSkills = Object.entries(skillCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([skill, count]) => ({ skill, count }));

  const monthMap = {};
  analyses.forEach((a) => {
    const month = a.date.slice(0, 7);
    if (!monthMap[month]) monthMap[month] = { total: 0, count: 0 };
    monthMap[month].total += a.ats_score;
    monthMap[month].count += 1;
  });

  const scoreByMonth = Object.entries(monthMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, data]) => ({
      month,
      avgScore: Math.round(data.total / data.count),
      count: data.count,
    }));

  const recentTrend = analyses.slice(0, 6).map((a) => ({
    id: a.id,
    date: a.date,
    filename: a.filename,
    job_role: a.job_role,
    ats_score: a.ats_score,
  }));

  return {
    totalAnalyses: analyses.length,
    averageScore,
    highestScore: Math.max(...scores),
    lowestScore: Math.min(...scores),
    topMissingSkills,
    scoreByMonth,
    recentTrend,
  };
}
