import UploadForm from "./UploadForm";

export default function UploadCard({
  jobRole,
  onJobRoleChange,
  selectedFile,
  onFileChange,
  onSubmit,
  loading,
  error,
  fieldErrors,
}) {
  return (
    <section className="card-dash upload-card-dash">
      <div className="card-dash-header">
        <div>
          <h2 className="card-dash-title">New analysis</h2>
          <p className="card-dash-desc mb-0">
            Upload a PDF resume and specify your target role to start.
          </p>
        </div>
        <span className="status-pill status-pill-neutral">
          <i className="bi bi-shield-check" />
          PDF only · 5 MB max
        </span>
      </div>

      {error && (
        <div className="alert-dash alert-dash-danger" role="alert">
          <i className="bi bi-exclamation-octagon-fill" />
          <span>{error}</span>
        </div>
      )}

      <div className="upload-dropzone">
        <UploadForm
          jobRole={jobRole}
          onJobRoleChange={onJobRoleChange}
          selectedFile={selectedFile}
          onFileChange={onFileChange}
          onSubmit={onSubmit}
          loading={loading}
          disabled={loading}
          fieldErrors={fieldErrors}
        />
      </div>
    </section>
  );
}
