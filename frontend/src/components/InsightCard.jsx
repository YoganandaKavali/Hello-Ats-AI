const VARIANTS = {
  strengths: {
    icon: "bi-arrow-up-circle-fill",
    accent: "insight-strengths",
  },
  weaknesses: {
    icon: "bi-arrow-down-circle-fill",
    accent: "insight-weaknesses",
  },
  suggestions: {
    icon: "bi-lightbulb-fill",
    accent: "insight-suggestions",
  },
};

export default function InsightCard({ title, variant, items }) {
  const config = VARIANTS[variant];
  if (!items?.length) return null;

  const ListTag = variant === "suggestions" ? "ol" : "ul";

  return (
    <section className={`card-dash insight-card ${config.accent}`}>
      <div className="card-dash-header compact">
        <h3 className="card-dash-title h6 mb-0">
          <i className={`bi ${config.icon} me-2`} />
          {title}
        </h3>
        <span className="badge-count">{items.length}</span>
      </div>
      <ListTag className="insight-list mb-0">
        {items.map((item, index) => (
          <li key={`${variant}-${index}`}>{item}</li>
        ))}
      </ListTag>
    </section>
  );
}
