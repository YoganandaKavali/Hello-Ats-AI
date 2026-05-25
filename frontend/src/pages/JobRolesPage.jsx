import { useMemo } from "react";
import { getJobRolesForUser, getRoleStats } from "../services/jobRolesService";
import EmptyState from "../components/EmptyState";

export default function JobRolesPage({ user, onSelectRole, onGoDashboard }) {
  const roles = useMemo(() => getJobRolesForUser(user.id), [user.id]);
  const stats = useMemo(() => getRoleStats(user.id), [user.id]);
  const hasHistory = stats.length > 0;

  return (
    <div className="page-section">
      <div className="page-section-head">
        <h2 className="page-title">Job roles</h2>
        <p className="page-subtitle mb-0">
          Target roles from your analyses and suggested roles for new scans.
        </p>
      </div>

      {!hasHistory && (
        <EmptyState
          icon="bi-briefcase"
          title="No analyzed roles yet"
          description="After you run a resume analysis, your target roles and average ATS scores will appear here."
          actionLabel="Analyze a resume"
          onAction={onGoDashboard}
        />
      )}

      {hasHistory && (
        <div className="card-dash mb-4">
          <div className="card-dash-header compact">
            <h3 className="card-dash-title h6 mb-0">Your analyzed roles</h3>
          </div>
          <div className="table-responsive">
            <table className="table-dash">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Analyses</th>
                  <th>Avg ATS</th>
                  <th>Last run</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stats.map((row) => (
                  <tr key={row.role}>
                    <td>
                      <strong>{row.role}</strong>
                    </td>
                    <td>{row.count}</td>
                    <td>
                      <span
                        className={`history-score score-${
                          row.avgScore >= 70 ? "high" : row.avgScore >= 40 ? "mid" : "low"
                        }`}
                      >
                        {row.avgScore}
                      </span>
                    </td>
                    <td className="text-muted small">
                      {new Date(row.lastDate).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-dash btn-dash-ghost btn-sm"
                        onClick={() => onSelectRole?.(row.role)}
                      >
                        Use on Dashboard
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card-dash">
        <div className="card-dash-header compact">
          <h3 className="card-dash-title h6 mb-0">
            {hasHistory ? "Suggested & saved roles" : "Suggested roles"}
          </h3>
          <span className="badge-count">{roles.length}</span>
        </div>
        <p className="text-muted small mb-3">
          Click a role to pre-fill the job role field on the Dashboard.
        </p>
        <div className="skill-badges-wrap">
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              className="skill-badge skill-badge-role"
              onClick={() => onSelectRole?.(role)}
            >
              <i className="bi bi-briefcase me-1" />
              {role}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
