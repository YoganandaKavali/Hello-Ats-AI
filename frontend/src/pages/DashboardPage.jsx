import { useState } from "react";
import { uploadResume } from "../api/resumeApi";
import { saveAnalysis } from "../services/analysisStorage";
import { validateUploadForm } from "../utils/validation";
import { getApiErrorMessage } from "../utils/apiErrors";
import UploadCard from "../components/UploadCard";
import AnalyzingLoader from "../components/AnalyzingLoader";
import AnalysisSkeleton from "../components/AnalysisSkeleton";
import AnalysisDashboard from "../components/AnalysisDashboard";
import EmptyDashboard from "../components/EmptyDashboard";

export default function DashboardPage({
  user,
  onAnalysisComplete,
  initialAnalysis,
  prefilledJobRole = "",
}) {
  const [jobRole, setJobRole] = useState(
    initialAnalysis?.job_role ?? prefilledJobRole ?? ""
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [analysis, setAnalysis] = useState(initialAnalysis ?? null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setAnalysis(null);

    const { valid, errors } = await validateUploadForm({
      file: selectedFile,
      jobRole,
    });
    setFieldErrors(errors);
    if (!valid) return;

    setLoading(true);

    try {
      const result = await uploadResume(selectedFile, jobRole);
      const saved = saveAnalysis(user.id, result);
      const display = { ...result, id: saved.id };
      setAnalysis(display);
      setFieldErrors({});
      onAnalysisComplete?.(display);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-columns">
        <div className="dashboard-col-upload">
          <UploadCard
            jobRole={jobRole}
            onJobRoleChange={setJobRole}
            selectedFile={selectedFile}
            onFileChange={(file) => {
              setSelectedFile(file);
              if (fieldErrors.resume) {
                setFieldErrors((prev) => ({ ...prev, resume: "" }));
              }
            }}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            fieldErrors={fieldErrors}
          />
        </div>

        <div className="dashboard-col-results">
          {loading && (
            <div className="loading-stack">
              <AnalyzingLoader />
              <AnalysisSkeleton />
            </div>
          )}

          {!loading && !analysis && <EmptyDashboard />}

          {!loading && analysis && <AnalysisDashboard analysis={analysis} />}
        </div>
      </div>
    </div>
  );
}
