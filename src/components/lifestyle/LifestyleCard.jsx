import Icon from "../../common/Icon";

/**
 * LifestyleCard — displays a single daily lifestyle log entry.
 *
 * Props:
 *  - log  {object}  { date, stress, sleep, exercise, diet, weight }
 */

const METRICS = [
  { key: "stress",   label: "Stress",  unit: "/10", icon: "sentiment_dissatisfied", color: "#c4837a" },
  { key: "sleep",    label: "Sleep",   unit: "h",   icon: "bedtime",                color: "#6aab8e" },
  { key: "exercise", label: "Move",    unit: "m",   icon: "directions_run",         color: "#7a9ec4" },
  { key: "weight",   label: "Weight",  unit: "kg",  icon: "monitor_weight",         color: "#b5a66e" },
];

const DIET_COLOR = {
  poor:  { bg: "#fdf0ee", text: "#b85a52" },
  okay:  { bg: "#f5f0e4", text: "#b5a66e" },
  good:  { bg: "#eef7f2", text: "#4a7a62" },
  great: { bg: "#d5e8e0", text: "#3a6b52" },
};

export default function LifestyleCard({ log }) {
  const dietStyle = DIET_COLOR[log.diet] || DIET_COLOR.okay;

  return (
    <div style={styles.card}>
      {/* Date row */}
      <div style={styles.topRow}>
        <div style={styles.dateWrap}>
          <Icon name="calendar_today" size={13} color="#a09488" />
          <span style={styles.date}>{log.date}</span>
        </div>
        <span
          style={{
            ...styles.dietBadge,
            background: dietStyle.bg,
            color: dietStyle.text,
          }}
        >
          {log.diet}
        </span>
      </div>

      {/* Metric row */}
      <div style={styles.metricRow}>
        {METRICS.map((m) => (
          <div key={m.key} style={styles.metric}>
            <Icon name={m.icon} size={14} color={m.color} />
            <span style={{ ...styles.metricValue, color: m.color }}>
              {log[m.key]}{m.unit}
            </span>
            <span style={styles.metricLabel}>{m.label.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  card: {
    background: "#ffffff",
    border: "1px solid #f0ebe4",
    borderRadius: 10,
    padding: "12px 16px",
    marginBottom: 10,
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dateWrap: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  date: {
    fontSize: 12,
    fontWeight: 500,
    color: "#4a3f3a",
  },
  dietBadge: {
    fontSize: 11,
    borderRadius: 4,
    padding: "2px 8px",
    fontWeight: 500,
    textTransform: "capitalize",
  },
  metricRow: {
    display: "flex",
    gap: 14,
  },
  metric: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: 500,
  },
  metricLabel: {
    fontSize: 9,
    color: "#b0a49a",
    letterSpacing: 0.5,
  },
};