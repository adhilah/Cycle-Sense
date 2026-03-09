import Icon from "../../common/Icon";

/**
 * StatCards — 3-column grid of key cycle statistics.
 *
 * Props:
 *  - stats  {object}  from usePeriods().stats
 *    {
 *      avgCycle:    number|null,
 *      avgDuration: number|null,
 *      variability: number|null,
 *    }
 */

const CARDS = [
  {
    key:   "avgCycle",
    label: "Avg Cycle",
    sub:   "between periods",
    icon:  "loop",
    color: "#c4837a",
    unit:  "d",
  },
  {
    key:   "avgDuration",
    label: "Avg Duration",
    sub:   "period length",
    icon:  "straighten",
    color: "#7a9ec4",
    unit:  "d",
  },
  {
    key:   "variability",
    label: "Variability",
    sub:   "cycle range",
    icon:  "show_chart",
    color: "#b5a66e",
    unit:  "d",
  },
];

export default function StatCards({ stats = {} }) {
  return (
    <div style={styles.grid}>
      {CARDS.map((c) => {
        const raw   = stats[c.key];
        const value = raw !== null && raw !== undefined ? `${raw}${c.unit}` : "—";
        const isEmpty = raw === null || raw === undefined;

        return (
          <div key={c.key} style={styles.card}>
            <Icon
              name={c.icon}
              size={18}
              color={isEmpty ? "#d5cec8" : c.color}
              style={{ marginBottom: 2 }}
            />
            <div
              style={{
                ...styles.value,
                color: isEmpty ? "#c8bfb5" : "#2a2420",
              }}
            >
              {value}
            </div>
            <div style={styles.label}>{c.label.toUpperCase()}</div>
            <div style={styles.sub}>{c.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 10,
    marginBottom: 20,
  },
  card: {
    background: "#ffffff",
    border: "1px solid #f0ebe4",
    borderRadius: 12,
    padding: "14px 10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    textAlign: "center",
  },
  value: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 22,
    fontWeight: 400,
    lineHeight: 1,
  },
  label: {
    fontSize: 10,
    color: "#a09488",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  sub: {
    fontSize: 10,
    color: "#c8bfb5",
  },
};