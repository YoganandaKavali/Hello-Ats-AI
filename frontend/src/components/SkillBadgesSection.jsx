function BadgeGroup({ title, icon, items, variant }) {
  return (
    <div className={`card-dash skill-badges-card skill-badges-${variant}`}>
      <div className="card-dash-header compact">
        <h3 className="card-dash-title h6 mb-0">
          <i className={`bi ${icon} me-2`} />
          {title}
        </h3>
        <span className="badge-count">{items?.length ?? 0}</span>
      </div>
      <div className="skill-badges-wrap">
        {items?.length ? (
          items.map((skill, i) => (
            <span key={`${title}-${i}`} className={`skill-badge skill-badge-${variant}`}>
              {skill}
            </span>
          ))
        ) : (
          <p className="text-muted small mb-0">No items detected.</p>
        )}
      </div>
    </div>
  );
}

export default function SkillBadgesSection({ skillsFound, missingSkills }) {
  return (
    <div className="skill-badges-grid">
      <BadgeGroup
        title="Skills found"
        icon="bi-check-circle-fill"
        items={skillsFound}
        variant="found"
      />
      <BadgeGroup
        title="Missing skills"
        icon="bi-dash-circle-fill"
        items={missingSkills}
        variant="missing"
      />
    </div>
  );
}
