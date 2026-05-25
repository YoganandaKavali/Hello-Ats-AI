export default function TopHeader({ onMenuToggle, user, analysisMeta }) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button
          type="button"
          className="btn-icon sidebar-toggle d-lg-none"
          onClick={onMenuToggle}
          aria-label="Open menu"
        >
          <i className="bi bi-list" />
        </button>
        <div>
          <p className="header-eyebrow mb-0">Workspace</p>
          <h1 className="header-title mb-0">ATS Resume Analyzer</h1>
        </div>
      </div>

      <div className="header-right">
        {analysisMeta && (
          <div className="header-meta d-none d-md-flex">
            <span className="header-meta-chip">
              <i className="bi bi-briefcase" />
              {analysisMeta.job_role}
            </span>
            <span className="header-meta-chip">
              <i className="bi bi-file-earmark-pdf" />
              {analysisMeta.resume_filename || analysisMeta.filename}
            </span>
          </div>
        )}
        <button type="button" className="btn-icon" aria-label="Notifications">
          <i className="bi bi-bell" />
        </button>
        <div className="header-profile">
          <div className="profile-text d-none d-sm-block">
            <span className="profile-name">{user?.name}</span>
            <span className="profile-role">{user?.email}</span>
          </div>
          <div className="profile-avatar" title={user?.email} aria-hidden="true">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
