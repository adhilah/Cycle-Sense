import Icon from "../../common/Icon";

/**
 * LifestyleCard — displays a single daily wellness check-in entry.
 * Shows mood, energy, water, sleep, exercise and note.
 */

const MOOD_MAP = {
  great: { icon: "sentiment_very_satisfied",    color: "#6aab8e", bg: "#eef7f2" },
  good:  { icon: "sentiment_satisfied",         color: "#7a9ec4", bg: "#f0f5fd" },
  okay:  { icon: "sentiment_neutral",           color: "#b5a66e", bg: "#f5f0e4" },
  low:   { icon: "sentiment_dissatisfied",      color: "#c4837a", bg: "#fdf0ee" },
  awful: { icon: "sentiment_very_dissatisfied", color: "#b85a52", bg: "#faeae8" },
};

const ENERGY_COLOR = {
  high:    { bg: "#eef7f2", text: "#4a7a62" },
  medium:  { bg: "#f5f0e4", text: "#8a7a48" },
  low:     { bg: "#fdf0ee", text: "#9a5a54" },
  crashed: { bg: "#faeae8", text: "#7a2a24" },
};

export default function LifestyleCard({ log, onDelete }) {
  const mood   = MOOD_MAP[log.mood]   || MOOD_MAP.okay;
  const energy = ENERGY_COLOR[log.energy] || ENERGY_COLOR.medium;

  return (
    <div style={styles.card}>
      {/* Top row: date + mood + energy badge */}
      <div style={styles.topRow}>
        <div style={styles.left}>
          <div style={{ ...styles.moodBubble, background: mood.bg }}>
            <Icon name={mood.icon} size={20} color={mood.color} />
            <span style={{ ...styles.moodLabel, color: mood.color }}>
              {log.mood?.charAt(0).toUpperCase() + log.mood?.slice(1)}
            </span>
          </div>
        </div>
        <div style={styles.right}>
          <span style={{ ...styles.energyBadge, background: energy.bg, color: energy.text }}>
            {log.energy?.charAt(0).toUpperCase() + log.energy?.slice(1)} energy
          </span>
          <span style={styles.date}>{log.date}</span>
        </div>
      </div>

      {/* Metrics strip */}
      <div style={styles.metricsRow}>
        <div style={styles.metric}>
          <Icon name="water_drop" size={13} color="#7a9ec4" />
          <span style={{ ...styles.metricVal, color: "#7a9ec4" }}>{log.water ?? "—"}</span>
          <span style={styles.metricUnit}>glasses</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.metric}>
          <Icon name="bedtime" size={13} color="#6aab8e" />
          <span style={{ ...styles.metricVal, color: "#6aab8e" }}>{log.sleep ?? "—"}h</span>
          <span style={styles.metricUnit}>sleep</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.metric}>
          <Icon name="directions_run" size={13} color="#b5a66e" />
          <span style={{ ...styles.metricVal, color: "#b5a66e" }}>{log.exercise ?? 0}m</span>
          <span style={styles.metricUnit}>moved</span>
        </div>
      </div>

      {/* Note */}
      {log.note && (
        <p style={styles.note}>
          <Icon name="format_quote" size={12} color="#c8bfb5" />
          {log.note}
        </p>
      )}

      {/* Delete */}
      {onDelete && (
        <button style={styles.deleteBtn} onClick={() => onDelete(log.date)}>
          <Icon name="delete_outline" size={15} color="#c4837a" />
        </button>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    border: "1px solid #f0ebe4",
    borderRadius: 12,
    padding: "14px 16px",
    marginBottom: 10,
    position: "relative",
  },
  topRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: 12,
  },
  left: {},
  right: {
    display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4,
  },
  moodBubble: {
    display: "inline-flex", alignItems: "center", gap: 6,
    borderRadius: 20, padding: "5px 12px",
  },
  moodLabel: {
    fontSize: 13, fontWeight: 500,
  },
  energyBadge: {
    fontSize: 11, borderRadius: 4, padding: "2px 8px", fontWeight: 500,
  },
  date: {
    fontSize: 11, color: "#b0a49a",
  },

  // Metrics
  metricsRow: {
    display: "flex", alignItems: "center", gap: 12,
  },
  metric: {
    display: "flex", alignItems: "center", gap: 4,
  },
  metricVal: {
    fontSize: 13, fontWeight: 500,
  },
  metricUnit: {
    fontSize: 10, color: "#b0a49a", letterSpacing: 0.3,
  },
  divider: {
    width: 1, height: 14, background: "#f0ebe4",
  },

  // Note
  note: {
    display: "flex", alignItems: "flex-start", gap: 4,
    fontSize: 12, color: "#a09488", fontStyle: "italic",
    marginTop: 10, lineHeight: 1.4,
  },

  // Delete
  deleteBtn: {
    position: "absolute", top: 10, right: 10,
    background: "none", border: "none", cursor: "pointer", padding: 4,
  },
};