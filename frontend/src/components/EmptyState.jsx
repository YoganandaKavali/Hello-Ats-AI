export default function EmptyState({
  icon = "bi-inbox",
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="card-dash empty-state-block">
      <div className="empty-dashboard-icon">
        <i className={`bi ${icon}`} />
      </div>
      <h3 className="h5 mb-2">{title}</h3>
      <p className="text-muted mb-0">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="btn-dash btn-dash-primary mt-3"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
