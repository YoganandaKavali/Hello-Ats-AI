import { useState } from "react";
import HelloAtsLogo from "../components/HelloAtsLogo";
import FormField from "../components/FormField";
import { validateLoginForm } from "../utils/validation";

export default function LoginPage({
  onLogin,
  onGoSignup,
  successMessage = "",
  onClearSuccessMessage,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    onClearSuccessMessage?.();

    const { valid, errors } = validateLoginForm({ email, password });
    setFieldErrors(errors);
    if (!valid) return;

    setLoading(true);

    try {
      await onLogin({ email: email.trim(), password });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card-dash">
        <div className="auth-brand">
          <HelloAtsLogo size="md" className="auth-logo-mark" />
          <div>
            <h1 className="auth-title">HELLO ATS</h1>
            <p className="auth-subtitle mb-0">Sign in to your workspace</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {successMessage && (
            <div className="alert-dash alert-dash-success" role="status">
              <i className="bi bi-check-circle-fill" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="alert-dash alert-dash-danger" role="alert">
              <i className="bi bi-exclamation-octagon-fill" />
              <span>{error}</span>
            </div>
          )}

          <FormField id="login-email" label="Email" error={fieldErrors.email}>
            <input
              id="login-email"
              type="email"
              className={`input-dash input-dash-plain ${fieldErrors.email ? "input-invalid" : ""}`}
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: "" }));
                }
              }}
              autoComplete="email"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
            />
          </FormField>

          <FormField id="login-password" label="Password" error={fieldErrors.password}>
            <input
              id="login-password"
              type="password"
              className={`input-dash input-dash-plain ${fieldErrors.password ? "input-invalid" : ""}`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: "" }));
                }
              }}
              autoComplete="current-password"
              aria-invalid={!!fieldErrors.password}
            />
          </FormField>

          <button
            type="submit"
            className="btn-dash btn-dash-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner" />
                Signing in…
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right" />
                Sign in
              </>
            )}
          </button>
        </form>

        <p className="auth-switch mb-0">
          Don&apos;t have an account?{" "}
          <button type="button" className="auth-link" onClick={onGoSignup}>
            Create account
          </button>
        </p>
      </div>
    </div>
  );
}
