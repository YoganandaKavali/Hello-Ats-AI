import HelloAtsLogo from "../HelloAtsLogo";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "bi-grid-1x2-fill" },
  { id: "analyses", label: "Analyses", icon: "bi-file-earmark-bar-graph" },
  { id: "roles", label: "Job roles", icon: "bi-briefcase" },
  { id: "insights", label: "Insights", icon: "bi-pie-chart" },
  { id: "settings", label: "Settings", icon: "bi-gear" },
];

export default function Sidebar({ open, onClose, activeView, onNavigate }) {
  const handleNav = (id) => {
    onNavigate(id);
    onClose?.();
  };

  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? "show" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`dashboard-sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-brand">
          <HelloAtsLogo size="sm" className="sidebar-logo-mark" />
          <div>
            <span className="sidebar-brand-name">HELLO ATS</span>
            <span className="sidebar-brand-tag">Resume Intelligence</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <span className="sidebar-nav-label">Menu</span>
          <ul className="list-unstyled mb-0">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`sidebar-nav-item ${
                    activeView === item.id ? "active" : ""
                  }`}
                  onClick={() => handleNav(item.id)}
                  aria-current={activeView === item.id ? "page" : undefined}
                >
                  <i className={`bi ${item.icon}`} />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-tip card-dash">
            <i className="bi bi-lightning-charge-fill" />
            <div>
              <strong>AI-powered</strong>
              <p className="mb-0">
                Gemini analyzes resumes against any target role.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
