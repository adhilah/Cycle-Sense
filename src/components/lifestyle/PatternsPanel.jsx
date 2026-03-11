import Icon from "../../common/Icon";

/**
 * PatternsPanel — shows a mood & energy streak summary from recent logs.
 * Now shows real patterns from actual check-in data.
 */

const MOOD_ORDER = ["great", "good", "okay", "low", "awful"];

export default function PatternsPanel({ logs = [] }) {
  if (logs.length === 0) return null;

  const recent = logs.slice(0, 7);

  // Mood streak
  const moodCounts = {};
  recent.forEach((l) => { moodCounts[l.mood] = (moodCounts[l.mood] || 0) + 1; });
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  // Avg sleep
  const avgSleep = (recent.reduce((s, l) => s + (l.sleep || 0), 0) / recent.length).toFixed(1);

  // Avg water
  const avgWater = (recent.reduce((s, l) => s + (l.water || 0), 0) / recent.length).toFixed(1);

  // Low energy days
  const lowEnergyDays = recent.filter((l) => l.energy === "low" || l.energy === "crashed").length;

  const insights = [
    {
      icon:  "auto_awesome",
      color: "#7a9ec4",
      bg:    "#f0f5fd",
      text:  topMood
        ? `Most common mood lately: ${topMood[0]} (${topMood[1]}/${recent.length} days)`
        : "Keep logging to see mood patterns",
    },
    {
      icon:  "bedtime",
      color: "#6aab8e",
      bg:    "#eef7f2",
      text:  `Averaging ${avgSleep}h of sleep over the last ${recent.length} days`,
    },
    {
      icon:  "water_drop",
      color: "#7a9ec4",
      bg:    "#f0f5fd",
      text:  `Drinking ${avgWater} glasses of water on average`,
    },
    lowEnergyDays > 0 && {
      icon:  "battery_low",
      color: "#c4837a",
      bg:    "#fdf0ee",
      text:  `${lowEnergyDays} low/crashed energy day${lowEnergyDays > 1 ? "s" : ""} in the past week`,
    },
  ].filter(Boolean);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <Icon name="insights" size={16} color="#a09488" />
        <p style={styles.headerLabel}>This Week at a Glance</p>
      </div>

      {/* Mood strip */}
      <div style={styles.moodStrip}>
        {recent.map((l, i) => {
          const colors = { great:"#6aab8e", good:"#7a9ec4", okay:"#b5a66e", low:"#c4837a", awful:"#b85a52" };
          const c = colors[l.mood] || "#c8bfb5";
          return (
            <div key={i} style={styles.moodDot} title={`${l.date} — ${l.mood}`}>
              <div style={{ ...styles.dot, background: c }} />
              <span style={styles.dotDate}>{l.date.slice(5)}</span>
            </div>
          );
        })}
      </div>

      {/* Insight rows */}
      {insights.map((ins, i) => (
        <div key={i} style={{ ...styles.insightRow, background: ins.bg }}>
          <Icon name={ins.icon} size={18} color={ins.color} />
          <p style={styles.insightText}>{ins.text}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    border: "1px solid #f0ebe4",
    borderRadius: 14,
    padding: "16px 20px",
    marginBottom: 20,
  },
  header: {
    display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
  },
  headerLabel: {
    fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#a09488",
  },

  // Mood dot strip
  moodStrip: {
    display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap",
  },
  moodDot: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
  },
  dot: {
    width: 10, height: 10, borderRadius: "50%",
  },
  dotDate: {
    fontSize: 9, color: "#c8bfb5",
  },

  // Insight row
  insightRow: {
    display: "flex", alignItems: "center", gap: 10,
    borderRadius: 8, padding: "9px 12px", marginBottom: 6,
  },
  insightText: {
    fontSize: 12, color: "#4a3f3a", lineHeight: 1.4,
  },
};