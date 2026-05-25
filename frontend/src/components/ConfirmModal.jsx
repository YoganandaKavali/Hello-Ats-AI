export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="modal-dialog card-dash"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-modal-title" className="modal-title">
          {title}
        </h2>
        <p id="confirm-modal-desc" className="modal-message">
          {message}
        </p>
        <div className="modal-actions">
          <button
            type="button"
            className="btn-dash btn-dash-ghost"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn-dash ${variant === "danger" ? "btn-dash-danger" : "btn-dash-primary"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
