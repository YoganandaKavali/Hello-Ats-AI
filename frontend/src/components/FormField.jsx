export default function FormField({
  id,
  label,
  error,
  children,
  hint,
}) {
  return (
    <div className={`upload-field ${error ? "has-error" : ""}`}>
      <label htmlFor={id} className="form-label-dash">
        {label}
      </label>
      {children}
      {error && (
        <p className="field-error" id={`${id}-error`} role="alert">
          <i className="bi bi-exclamation-circle" />
          {error}
        </p>
      )}
      {hint && !error && <p className="field-hint">{hint}</p>}
    </div>
  );
}
