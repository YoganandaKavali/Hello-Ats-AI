export default function EmptyDashboard() {
  return (
    <div className="card-dash empty-dashboard">
      <div className="empty-dashboard-icon">
        <i className="bi bi-bar-chart-steps" />
      </div>
      <h2 className="h5 mb-2">No analysis yet</h2>
      <p className="text-muted mb-0">
        Upload a resume and run ATS analysis to see your score, skill breakdown,
        and AI recommendations here.
      </p>
      <ul className="empty-features list-unstyled mb-0">
        <li>
          <i className="bi bi-speedometer2" />
          ATS compatibility score
        </li>
        <li>
          <i className="bi bi-tags" />
          Skills found & gaps
        </li>
        <li>
          <i className="bi bi-chat-square-text" />
          Actionable suggestions
        </li>
      </ul>
    </div>
  );
}
