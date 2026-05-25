const STEPS = [
  { label: "Uploading resume", icon: "bi-cloud-upload" },
  { label: "Extracting PDF text", icon: "bi-file-text" },
  { label: "Running ATS analysis", icon: "bi-cpu" },
  { label: "Generating insights", icon: "bi-stars" },
];

export default function AnalyzingLoader() {
  return (
    <div className="analyzing-loader card-dash" role="status" aria-live="polite">
      <div className="analyzing-visual">
        <div className="analyzing-rings">
          <span className="ring ring-1" />
          <span className="ring ring-2" />
          <span className="ring ring-3" />
        </div>
        <div className="analyzing-core">
          <i className="bi bi-file-earmark-person" />
        </div>
      </div>

      <h2 className="analyzing-title">Analyzing your resume</h2>
      <p className="analyzing-subtitle">
        Our AI is reviewing ATS compatibility, skills, and role fit. This usually
        takes 15–30 seconds.
      </p>

      <ul className="analyzing-steps list-unstyled mb-0">
        {STEPS.map((step, index) => (
          <li
            key={step.label}
            className="analyzing-step"
            style={{ animationDelay: `${index * 0.35}s` }}
          >
            <span className="step-icon">
              <i className={`bi ${step.icon}`} />
            </span>
            <span className="step-label">{step.label}</span>
            <span className="step-pulse" />
          </li>
        ))}
      </ul>

      <div className="analyzing-progress">
        <div className="analyzing-progress-bar" />
      </div>
    </div>
  );
}
