import { useMemo, useState } from "react";
import { getAnalysesForUser, deleteAnalysis } from "../services/analysisStorage";
import AnalysisDashboard from "../components/AnalysisDashboard";
import EmptyState from "../components/EmptyState";
import ConfirmModal from "../components/ConfirmModal";

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function scoreClass(score) {
  if (score >= 70) return "high";
  if (score >= 40) return "mid";
  return "low";
}

export default function AnalysesPage({ user, onRefresh, onGoDashboard }) {
  const [selectedId, setSelectedId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const analyses = useMemo(
    () => getAnalysesForUser(user.id),
    [user.id, refreshKey]
  );

  const selected = analyses.find((a) => a.id === selectedId) ?? null;

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteAnalysis(user.id, deleteTarget.id);
    if (selectedId === deleteTarget.id) setSelectedId(null);
    setRefreshKey((k) => k + 1);
    onRefresh?.();
    setDeleteTarget(null);
  };

  if (!analyses.length) {
    return (
      <div className="page-section">
        <div className="page-section-head">
          <h2 className="page-title">Analyses history</h2>
          <p className="page-subtitle mb-0">
            Review and manage your past resume scans.
          </p>
        </div>
        <EmptyState
          icon="bi-clock-history"
          title="No analyses yet"
          description="Run your first ATS analysis on the Dashboard. Results are saved here automatically."
          actionLabel="Go to Dashboard"
          onAction={onGoDashboard}
        />
      </div>
    );
  }

  return (
    <div className="page-section">
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete analysis?"
        message={
          deleteTarget
            ? `Remove "${deleteTarget.filename}" (${deleteTarget.job_role}) from your history? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Keep"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="page-section-head">
        <h2 className="page-title">Analyses history</h2>
        <p className="page-subtitle mb-0">
          {analyses.length} saved {analyses.length === 1 ? "analysis" : "analyses"}
        </p>
      </div>

      <div className="history-layout">
        <div className="history-list">
          {analyses.map((item) => (
            <article
              key={item.id}
              className={`card-dash history-item ${selectedId === item.id ? "active" : ""}`}
            >
              <div className="history-item-top">
                <div>
                  <h3 className="history-filename">{item.filename}</h3>
                  <p className="history-meta mb-0">
                    <i className="bi bi-briefcase me-1" />
                    {item.job_role}
                  </p>
                  <p className="history-date mb-0">{formatDate(item.date)}</p>
                </div>
                <span className={`history-score score-${scoreClass(item.ats_score)}`}>
                  {item.ats_score}
                </span>
              </div>
              <div className="history-skills-preview">
                {(item.skills_found || []).slice(0, 3).map((s, i) => (
                  <span key={i} className="skill-badge skill-badge-found">
                    {s}
                  </span>
                ))}
                {(item.skills_found?.length ?? 0) > 3 && (
                  <span className="text-muted small">
                    +{item.skills_found.length - 3} more
                  </span>
                )}
              </div>
              <div className="history-actions">
                <button
                  type="button"
                  className="btn-dash btn-dash-ghost btn-sm"
                  onClick={() => setSelectedId(item.id)}
                >
                  <i className="bi bi-eye" />
                  View details
                </button>
                <button
                  type="button"
                  className="btn-dash btn-dash-ghost btn-sm text-danger"
                  onClick={() => setDeleteTarget(item)}
                >
                  <i className="bi bi-trash" />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="history-detail">
          {selected ? (
            <AnalysisDashboard
              analysis={{
                ...selected,
                resume_filename: selected.filename,
                job_role: selected.job_role,
                ats_score: selected.ats_score,
                skills_found: selected.skills_found,
                missing_skills: selected.missing_skills,
                strengths: selected.strengths,
                weaknesses: selected.weaknesses,
                suggestions: selected.suggestions,
                extracted_text_length: selected.extracted_text_length,
                status: selected.status || "analysis_complete",
              }}
            />
          ) : (
            <EmptyState
              icon="bi-eye"
              title="Select an analysis"
              description="Choose a saved analysis from the list to view full ATS results and recommendations."
            />
          )}
        </div>
      </div>
    </div>
  );
}
