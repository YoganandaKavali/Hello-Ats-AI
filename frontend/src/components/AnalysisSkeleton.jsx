export default function AnalysisSkeleton() {
  return (
    <div className="analysis-skeleton card-dash" aria-busy="true" aria-label="Analyzing resume">
      <div className="skeleton-header">
        <div className="skeleton-spinner" />
        <div>
          <p className="skeleton-title-text mb-1">Analyzing your resume</p>
          <p className="skeleton-sub text-muted mb-0">
            Extracting text and running AI analysis…
          </p>
        </div>
      </div>

      <div className="skeleton-score-row">
        <div className="skeleton-circle" />
        <div className="skeleton-lines flex-grow-1">
          <div className="skeleton-line w-75" />
          <div className="skeleton-line w-100" />
          <div className="skeleton-line w-50" />
        </div>
      </div>

      <div className="skeleton-grid">
        <div className="skeleton-card">
          <div className="skeleton-line w-40" />
          <div className="skeleton-badges">
            <span className="skeleton-pill" />
            <span className="skeleton-pill" />
            <span className="skeleton-pill" />
          </div>
        </div>
        <div className="skeleton-card">
          <div className="skeleton-line w-40" />
          <div className="skeleton-badges">
            <span className="skeleton-pill" />
            <span className="skeleton-pill" />
          </div>
        </div>
      </div>

      <div className="skeleton-lines">
        <div className="skeleton-line w-100" />
        <div className="skeleton-line w-90" />
        <div className="skeleton-line w-70" />
      </div>
    </div>
  );
}
