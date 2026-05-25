import FormField from "./FormField";

export default function UploadForm({
  jobRole,
  onJobRoleChange,
  selectedFile,
  onFileChange,
  onSubmit,
  loading,
  disabled,
  fieldErrors = {},
}) {
  const handleFileInput = (event) => {
    const file = event.target.files?.[0] ?? null;
    onFileChange(file);
  };

  return (
    <form onSubmit={onSubmit} className="upload-form" noValidate>
      <FormField id="resume" label="Resume document" error={fieldErrors.resume}>
        <label
          htmlFor="resume"
          className={`file-picker ${fieldErrors.resume ? "file-picker-invalid" : ""}`}
        >
          <input
            id="resume"
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileInput}
            disabled={loading || disabled}
            hidden
            aria-invalid={!!fieldErrors.resume}
          />
          <span className="file-picker-icon">
            <i className="bi bi-cloud-arrow-up" />
          </span>
          <span className="file-picker-text">
            {selectedFile ? (
              <>
                <strong>{selectedFile.name}</strong>
                <small>{(selectedFile.size / 1024).toFixed(1)} KB · PDF</small>
              </>
            ) : (
              <>
                <strong>Click to upload PDF</strong>
                <small>Max 5 MB · text-based PDF recommended</small>
              </>
            )}
          </span>
        </label>
      </FormField>

      <FormField id="jobRole" label="Target job role" error={fieldErrors.job_role}>
        <div className="input-icon-wrap">
          <i className="bi bi-briefcase input-icon" />
          <input
            id="jobRole"
            type="text"
            className={`input-dash ${fieldErrors.job_role ? "input-invalid" : ""}`}
            placeholder="e.g. Python Developer, Product Manager"
            value={jobRole}
            onChange={(e) => onJobRoleChange(e.target.value)}
            disabled={loading || disabled}
            maxLength={120}
            aria-invalid={!!fieldErrors.job_role}
          />
        </div>
      </FormField>

      <button
        type="submit"
        className="btn-dash btn-dash-primary w-100"
        disabled={loading || disabled}
      >
        {loading ? (
          <>
            <span className="btn-spinner" aria-hidden="true" />
            Analyzing…
          </>
        ) : (
          <>
            <i className="bi bi-play-fill" />
            Run ATS analysis
          </>
        )}
      </button>
    </form>
  );
}
