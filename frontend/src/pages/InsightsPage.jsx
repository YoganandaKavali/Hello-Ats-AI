import { useMemo } from "react";
import { getInsightsForUser } from "../services/insightsService";
import EmptyState from "../components/EmptyState";

export default function InsightsPage({ user, onGoDashboard }) {
  const insights = useMemo(() => getInsightsForUser(user.id), [user.id]);

  if (!insights.totalAnalyses) {
    return (
      <div className="page-section">
        <div className="page-section-head">
          <h2 className="page-title">Insights</h2>
          <p className="page-subtitle mb-0">
            Analytics and trends from your resume analyses.
          </p>
        </div>
        <EmptyState
          icon="bi-graph-up-arrow"
          title="No insights available"
          description="Complete at least one resume analysis to see average ATS scores, skill gaps, and trends over time."
          actionLabel="Run first analysis"
          onAction={onGoDashboard}
        />
      </div>
    );
  }

  return (
    <div className="page-section">
      <div className="page-section-head">
        <h2 className="page-title">Insights</h2>
        <p className="page-subtitle mb-0">
          Overview from {insights.totalAnalyses} saved{" "}
          {insights.totalAnalyses === 1 ? "analysis" : "analyses"}.
        </p>
      </div>

      <div className="insights-stats-grid">
        <div className="card-dash stat-card">
          <span className="stat-label">Total analyses</span>
          <span className="stat-value">{insights.totalAnalyses}</span>
        </div>
        <div className="card-dash stat-card">
          <span className="stat-label">Average ATS score</span>
          <span className="stat-value">{insights.averageScore}</span>
        </div>
        <div className="card-dash stat-card">
          <span className="stat-label">Highest score</span>
          <span className="stat-value text-success">{insights.highestScore}</span>
        </div>
        <div className="card-dash stat-card">
          <span className="stat-label">Lowest score</span>
          <span className="stat-value text-danger">{insights.lowestScore}</span>
        </div>
      </div>

      <div className="dashboard-grid mt-4">
        <div className="card-dash">
          <div className="card-dash-header compact">
            <h3 className="card-dash-title h6 mb-0">Top missing skills</h3>
          </div>
          {insights.topMissingSkills.length ? (
            <ul className="insight-bar-list mb-0">
              {insights.topMissingSkills.map(({ skill, count }) => (
                <li key={skill}>
                  <span className="bar-label">{skill}</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(count / insights.topMissingSkills[0].count) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="bar-count">{count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted small mb-0">No missing skills recorded yet.</p>
          )}
        </div>

        <div className="card-dash">
          <div className="card-dash-header compact">
            <h3 className="card-dash-title h6 mb-0">Score by month</h3>
          </div>
          {insights.scoreByMonth.length ? (
            <ul className="insight-bar-list mb-0">
              {insights.scoreByMonth.map(({ month, avgScore, count }) => (
                <li key={month}>
                  <span className="bar-label">{month}</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill bar-fill-primary"
                      style={{ width: `${avgScore}%` }}
                    />
                  </div>
                  <span className="bar-count">
                    {avgScore} ({count})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted small mb-0">Not enough data.</p>
          )}
        </div>

        <div className="card-dash grid-span-full">
          <div className="card-dash-header compact">
            <h3 className="card-dash-title h6 mb-0">Recent trend</h3>
          </div>
          <div className="table-responsive">
            <table className="table-dash">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>File</th>
                  <th>Role</th>
                  <th>ATS</th>
                </tr>
              </thead>
              <tbody>
                {insights.recentTrend.map((row) => (
                  <tr key={row.id}>
                    <td className="text-muted small">
                      {new Date(row.date).toLocaleDateString()}
                    </td>
                    <td>{row.filename}</td>
                    <td>{row.job_role}</td>
                    <td>
                      <strong>{row.ats_score}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
