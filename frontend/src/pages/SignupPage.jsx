import { useState } from "react";
import HelloAtsLogo from "../components/HelloAtsLogo";
import FormField from "../components/FormField";
import { validateSignupForm } from "../utils/validation";

export default function SignupPage({ onSignup, onGoLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { valid, errors } = validateSignupForm({ name, email, password });
    setFieldErrors(errors);
    if (!valid) return;

    setLoading(true);

    try {
      await onSignup({ name: name.trim(), email: email.trim(), password });
    } catch (err) {
      setError(err.message || "Signup failed.");
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
            <p className="auth-subtitle mb-0">Create your account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {error && (
            <div className="alert-dash alert-dash-danger" role="alert">
              <i className="bi bi-exclamation-octagon-fill" />
              <span>{error}</span>
            </div>
          )}

          <FormField id="signup-name" label="Full name" error={fieldErrors.name}>
            <input
              id="signup-name"
              type="text"
              className={`input-dash input-dash-plain ${fieldErrors.name ? "input-invalid" : ""}`}
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: "" }));
              }}
              autoComplete="name"
              aria-invalid={!!fieldErrors.name}
            />
          </FormField>

          <FormField id="signup-email" label="Email" error={fieldErrors.email}>
            <input
              id="signup-email"
              type="email"
              className={`input-dash input-dash-plain ${fieldErrors.email ? "input-invalid" : ""}`}
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: "" }));
              }}
              autoComplete="email"
              aria-invalid={!!fieldErrors.email}
            />
          </FormField>

          <FormField
            id="signup-password"
            label="Password"
            error={fieldErrors.password}
            hint="Minimum 6 characters"
          >
            <input
              id="signup-password"
              type="password"
              className={`input-dash input-dash-plain ${fieldErrors.password ? "input-invalid" : ""}`}
              placeholder="Create a password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: "" }));
              }}
              autoComplete="new-password"
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
                Creating account…
              </>
            ) : (
              <>
                <i className="bi bi-person-plus" />
                Create account
              </>
            )}
          </button>
        </form>

        <p className="auth-switch mb-0">
          Already have an account?{" "}
          <button type="button" className="auth-link" onClick={onGoLogin}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
