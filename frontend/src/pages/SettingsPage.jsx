import { useAuth } from "../context/AuthContext";
import { getAnalysesForUser } from "../services/analysisStorage";

export default function SettingsPage({ onLogout }) {
  const { user } = useAuth();
  const analysisCount = user ? getAnalysesForUser(user.id).length : 0;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="page-section">
      <div className="page-section-head">
        <h2 className="page-title">Settings</h2>
        <p className="page-subtitle mb-0">Manage your profile and session.</p>
      </div>

      <div className="settings-grid">
        <div className="card-dash settings-profile-card">
          <div className="settings-avatar">{initials}</div>
          <div>
            <h3 className="h5 mb-1">{user?.name}</h3>
            <p className="text-muted mb-2">{user?.email}</p>
            <span className="status-pill status-pill-neutral">
              <i className="bi bi-shield-check" />
              Local account
            </span>
          </div>
        </div>

        <div className="card-dash">
          <div className="card-dash-header compact">
            <h3 className="card-dash-title h6 mb-0">Account details</h3>
          </div>
          <dl className="settings-dl">
            <div>
              <dt>Full name</dt>
              <dd>{user?.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user?.email}</dd>
            </div>
            <div>
              <dt>Member since</dt>
              <dd>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
            <div>
              <dt>Saved analyses</dt>
              <dd>{analysisCount}</dd>
            </div>
          </dl>
        </div>

        <div className="card-dash settings-danger-zone">
          <div className="card-dash-header compact">
            <h3 className="card-dash-title h6 mb-0">Session</h3>
          </div>
          <p className="text-muted small mb-3">
            Sign out of HELLO ATS on this device. Your saved analyses remain in
            local storage.
          </p>
          <button
            type="button"
            className="btn-dash btn-dash-danger"
            onClick={onLogout}
          >
            <i className="bi bi-box-arrow-right" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
