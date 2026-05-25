/**
 * HELLO ATS brand mark — AI robot + neural circuit motif.
 */
export default function HelloAtsLogo({ size = "md", className = "" }) {
  const pixelSize = { sm: 42, md: 52, lg: 64 }[size] ?? 52;

  return (
    <div
      className={`hello-ats-logo hello-ats-logo--${size} ${className}`.trim()}
      style={{ width: pixelSize, height: pixelSize }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hello-ats-logo-svg"
      >
        <defs>
          <linearGradient id="logoBg" x1="8" y1="4" x2="56" y2="60">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="logoGlow" x1="20" y1="16" x2="44" y2="48">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </linearGradient>
          <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Card background */}
        <rect
          x="4"
          y="4"
          width="56"
          height="56"
          rx="14"
          fill="url(#logoBg)"
          filter="url(#logoShadow)"
        />

        {/* Circuit traces */}
        <path
          d="M12 22h6M46 22h6M12 42h8M44 42h8M32 12v4M32 48v4"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="22" r="2" fill="rgba(255,255,255,0.5)" />
        <circle cx="52" cy="22" r="2" fill="rgba(255,255,255,0.5)" />
        <circle cx="32" cy="12" r="2" fill="rgba(255,255,255,0.45)" />

        {/* Neural nodes */}
        <path
          d="M22 28c4-6 16-6 20 0M24 36c3 4 13 4 16 0"
          stroke="url(#logoGlow)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.9"
        />
        <circle cx="26" cy="30" r="1.5" fill="#e0e7ff" />
        <circle cx="38" cy="30" r="1.5" fill="#e0e7ff" />
        <circle cx="32" cy="34" r="2" fill="#fff" opacity="0.9" />

        {/* Robot head */}
        <rect
          x="18"
          y="20"
          width="28"
          height="24"
          rx="8"
          fill="rgba(255,255,255,0.95)"
        />
        {/* Antenna */}
        <line
          x1="32"
          y1="16"
          x2="32"
          y2="20"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="32" cy="14" r="3" fill="#a5b4fc" stroke="#fff" strokeWidth="1.5" />

        {/* Eyes (AI lens) */}
        <rect x="22" y="26" width="8" height="8" rx="2" fill="#4f46e5" />
        <rect x="34" y="26" width="8" height="8" rx="2" fill="#4f46e5" />
        <circle cx="26" cy="30" r="1.5" fill="#c7d2fe" />
        <circle cx="38" cy="30" r="1.5" fill="#c7d2fe" />

        {/* Smile / processor slot */}
        <path
          d="M26 38h12"
          stroke="#7c3aed"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="29" y="36" width="6" height="2" rx="1" fill="#a5b4fc" />
      </svg>
    </div>
  );
}
