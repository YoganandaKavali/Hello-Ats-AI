import AtsScoreCard from "./AtsScoreCard";
import SkillBadgesSection from "./SkillBadgesSection";
import InsightCard from "./InsightCard";

export default function AnalysisDashboard({ analysis }) {
  const {
    ats_score,
    skills_found,
    missing_skills,
    strengths,
    weaknesses,
    suggestions,
    job_role,
    resume_filename,
    extracted_text_length,
    status,
  } = analysis;

  return (
    <div className="analysis-dashboard" aria-live="polite">
      <div className="dashboard-page-head">
        <div>
          <h2 className="page-title">Analysis overview</h2>
          <p className="page-subtitle mb-0">
            Results for <strong>{resume_filename}</strong>
            {extracted_text_length != null && (
              <span className="text-muted">
                {" "}
                · {extracted_text_length.toLocaleString()} characters extracted
              </span>
            )}
          </p>
        </div>
        {status && (
          <span className="status-pill status-pill-success">
            <i className="bi bi-check2-circle" />
            {status.replace(/_/g, " ")}
          </span>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="grid-span-full">
          <AtsScoreCard score={ats_score} jobRole={job_role} />
        </div>

        <div className="grid-span-full">
          <SkillBadgesSection
            skillsFound={skills_found}
            missingSkills={missing_skills}
          />
        </div>

        <InsightCard title="Strengths" variant="strengths" items={strengths} />
        <InsightCard title="Weaknesses" variant="weaknesses" items={weaknesses} />
        <InsightCard
          title="Suggestions"
          variant="suggestions"
          items={suggestions}
        />
      </div>
    </div>
  );
}
