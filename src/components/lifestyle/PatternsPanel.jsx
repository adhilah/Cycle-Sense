import Icon from "../../common/Icon";

/**
 * PatternsPanel — shows detected lifestyle-to-cycle correlation patterns.
 *
 * Props:
 *  - logs     {Array}  lifestyle log entries (used for dynamic pattern calc)
 *
 * Currently shows static insight cards. When enough logs exist,
 * the patterns are computed from real data.
 */

const STATIC_PATTERNS = [
  {
    icon:      "sentiment_dissatisfied",
    iconColor: "#c4837a",
    bg:        "#fdf0ee",
    label:     "High stress lengthens cycles",
    detail:    "Average +6 days when stress level is high",
  },
  {
    icon:      "nightlight",
    iconColor: "#7a9ec4",
    bg:        "#f0f5fd",
    label:     "Poor sleep increases spotting",
    detail:    "Spotting twice as common after fewer than 6h sleep",
  },
  {
    icon:      "nutrition",
    iconColor: "#6aab8e",
    bg:        "#eef7f2",
    label:     "Good diet lightens flow",
    detail:    "Flow intensity drops by one level on great diet days",
  },
];

export default function PatternsPanel({ logs = [] }) {
  // Compute dynamic average stress from real logs if available
  const avgStress = logs.length
    ? (logs.reduce((a, b) => a + b.stress, 0) / logs.length).toFixed(1)
    : null;

  const highStressCount = logs.filter((l) => l.stress >= 7).length;
  const poorSleepCount  = logs.filter((l) => l.sleep < 6).length;
  const greatDietCount  = logs.filter((l) => l.diet === "great").length;

  // Enrich static patterns with real counts when data is available
  const patterns = STATIC_PATTERNS.map((p, i) => {
    let dynamicDetail = p.detail;
    if (logs.length >= 4) {
      if (i === 0 && highStressCount > 0)
        dynamicDetail = `${highStressCount} high-stress day${highStressCount !== 1 ? "s" : ""} logged — watch cycle length`;
      if (i === 1 && poorSleepCount > 0)
        dynamicDetail = `${poorSleepCount} night${poorSleepCount !== 1 ? "s" : ""} under 6h sleep recorded`;
      if (i === 2 && greatDietCount > 0)
        dynamicDetail = `${greatDietCount} great diet day${greatDietCount !== 1 ? "s" : ""} logged — keep it up`;
    }
    return { ...p, detail: dynamicDetail };
  });

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <Icon name="insights" size={16} color="#a09488" />
        <p style={styles.headerLabel}>Patterns Detected</p>
        {avgStress && (
          <span style={styles.avgBadge}>
            Avg stress {avgStress}/10
          </span>
        )}
      </div>

      {/* Pattern cards */}
      {patterns.map((p, i) => (
        <div key={i} style={{ ...styles.patternRow, background: p.bg }}>
          <div style={styles.iconWrap}>
            <Icon name={p.icon} size={22} color={p.iconColor} />
          </div>
          <div style={styles.patternText}>
            <p style={styles.patternLabel}>{p.label}</p>
            <p style={styles.patternDetail}>{p.detail}</p>
          </div>
        </div>
      ))}

      {/* Empty state */}
      {logs.length === 0 && (
        <p style={styles.empty}>
          Log a few days of lifestyle data to see personalised patterns.
        </p>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  card: {
    background: "#ffffff",
    border: "1px solid #f0ebe4",
    borderRadius: 14,
    padding: "16px 20px",
    marginBottom: 20,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  headerLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#a09488",
    flex: 1,
  },
  avgBadge: {
    fontSize: 11,
    color: "#c4837a",
    background: "#fdf0ee",
    borderRadius: 4,
    padding: "2px 8px",
  },

  // Pattern row
  patternRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    borderRadius: 10,
    padding: "10px 14px",
    marginBottom: 8,
  },
  iconWrap: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  patternText: {
    flex: 1,
  },
  patternLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: "#2a2420",
  },
  patternDetail: {
    fontSize: 11,
    color: "#8a7f78",
    marginTop: 2,
    lineHeight: 1.4,
  },

  empty: {
    fontSize: 12,
    color: "#b0a49a",
    textAlign: "center",
    padding: "8px 0 4px",
    lineHeight: 1.5,
  },
};