function getScoreTier(score) {
  if (score >= 70) return { tier: "high", label: "Strong match", color: "#10b981" };
  if (score >= 40) return { tier: "mid", label: "Moderate fit", color: "#f59e0b" };
  return { tier: "low", label: "Needs work", color: "#ef4444" };
}

function ScoreRing({ score, color }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="ats-ring">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle className="ats-ring-bg" cx="60" cy="60" r={radius} />
        <circle
          className="ats-ring-fill"
          cx="60"
          cy="60"
          r={radius}
          style={{
            stroke: color,
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="ats-ring-center">
        <span className="ats-ring-value">{score}</span>
        <span className="ats-ring-label">/ 100</span>
      </div>
    </div>
  );
}

export default function AtsScoreCard({ score, jobRole }) {
  const { tier, label, color } = getScoreTier(score);

  const metrics = [
    { label: "Keyword match", value: Math.min(100, score + 5) },
    { label: "Role alignment", value: score },
    { label: "Structure & format", value: Math.max(0, score - 8) },
  ];

  const summary =
    score >= 70
      ? "Your resume aligns well with ATS screening for this role. Polish impact metrics and keywords."
      : score >= 40
        ? "Decent foundation. Strengthen missing skills and quantify achievements."
        : "Significant gaps detected. Prioritize role-specific skills and clearer sections.";

  return (
    <section className="card-dash ats-score-card">
      <div className="card-dash-header">
        <div>
          <h2 className="card-dash-title">ATS score analytics</h2>
          <p className="card-dash-desc mb-0">Compatibility for {jobRole}</p>
        </div>
        <span className={`status-pill status-pill-${tier}`}>{label}</span>
      </div>

      <div className="ats-score-body">
        <ScoreRing score={score} color={color} />
        <div className="ats-score-details">
          <p className="ats-summary">{summary}</p>
          <div className="ats-metrics">
            {metrics.map((m) => (
              <div key={m.label} className="ats-metric">
                <div className="ats-metric-head">
                  <span>{m.label}</span>
                  <span>{m.value}%</span>
                </div>
                <div className="ats-metric-track">
                  <div
                    className="ats-metric-fill"
                    style={{ width: `${m.value}%`, background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
