import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AnalysesPage from "./pages/AnalysesPage";
import JobRolesPage from "./pages/JobRolesPage";
import InsightsPage from "./pages/InsightsPage";
import SettingsPage from "./pages/SettingsPage";
import "./App.css";

const SIGNUP_SUCCESS_MESSAGE =
  "Account created successfully. Please login.";

function AppRoutes() {
  const { user, ready, login, signup, logout } = useAuth();
  const [authScreen, setAuthScreen] = useState("login");
  const [loginMessage, setLoginMessage] = useState("");
  const [activeView, setActiveView] = useState("dashboard");
  const [prefilledJobRole, setPrefilledJobRole] = useState("");
  const [dashboardKey, setDashboardKey] = useState(0);
  const [dashboardInitialAnalysis, setDashboardInitialAnalysis] = useState(null);
  const [latestAnalysisMeta, setLatestAnalysisMeta] = useState(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  if (!ready) {
    return (
      <div className="auth-page">
        <div className="auth-loading">
          <span className="btn-spinner auth-spinner" />
          <p>Loading HELLO ATS…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    const goToLogin = (message = "") => {
      setAuthScreen("login");
      setLoginMessage(message);
    };

    const goToSignup = () => {
      setAuthScreen("signup");
      setLoginMessage("");
    };

    if (authScreen === "signup") {
      return (
        <SignupPage
          onSignup={async (data) => {
            await signup(data);
            goToLogin(SIGNUP_SUCCESS_MESSAGE);
          }}
          onGoLogin={() => goToLogin("")}
        />
      );
    }

    return (
      <LoginPage
        onLogin={login}
        onGoSignup={goToSignup}
        successMessage={loginMessage}
        onClearSuccessMessage={() => setLoginMessage("")}
      />
    );
  }

  const handleNavigate = (view) => {
    setActiveView(view);
    if (view !== "dashboard") {
      setLatestAnalysisMeta(null);
    }
  };

  const handleGoDashboard = () => setActiveView("dashboard");

  const handleSelectRole = (role) => {
    setPrefilledJobRole(role);
    setDashboardInitialAnalysis(null);
    setDashboardKey((k) => k + 1);
    setActiveView("dashboard");
  };

  const handleAnalysisComplete = (result) => {
    setLatestAnalysisMeta({
      job_role: result.job_role,
      resume_filename: result.resume_filename,
    });
    setHistoryRefresh((k) => k + 1);
  };

  const handleLogout = () => {
    logout();
    setAuthScreen("login");
    setLoginMessage("");
    setActiveView("dashboard");
    setPrefilledJobRole("");
    setDashboardInitialAnalysis(null);
    setLatestAnalysisMeta(null);
  };

  const analysisMeta =
    activeView === "dashboard" ? latestAnalysisMeta : null;

  const renderView = () => {
    switch (activeView) {
      case "analyses":
        return (
          <AnalysesPage
            key={historyRefresh}
            user={user}
            onRefresh={() => setHistoryRefresh((k) => k + 1)}
            onGoDashboard={handleGoDashboard}
          />
        );
      case "roles":
        return (
          <JobRolesPage
            user={user}
            onSelectRole={handleSelectRole}
            onGoDashboard={handleGoDashboard}
          />
        );
      case "insights":
        return (
          <InsightsPage
            user={user}
            key={historyRefresh}
            onGoDashboard={handleGoDashboard}
          />
        );
      case "settings":
        return <SettingsPage onLogout={handleLogout} />;
      case "dashboard":
      default:
        return (
          <DashboardPage
            key={`${dashboardKey}-${prefilledJobRole}`}
            user={user}
            initialAnalysis={dashboardInitialAnalysis}
            prefilledJobRole={prefilledJobRole}
            onAnalysisComplete={handleAnalysisComplete}
          />
        );
    }
  };

  return (
    <DashboardLayout
      user={user}
      activeView={activeView}
      onNavigate={handleNavigate}
      analysisMeta={analysisMeta}
    >
      {renderView()}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
