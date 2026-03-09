import Icon from "../../common/Icon";
import { getTopSymptoms } from "../../utils/cycleUtils";
import { getSymptomLabel, getSymptomIcon } from "../../constants/symptoms";

/**
 * SymptomsChart — horizontal bar chart of the most frequent symptoms.
 *
 * Props:
 *  - periods  {object[]}  all period log entries { symptoms: string[] }
 *  - topN     {number}    max symptoms to show (default 5)
 */

export default function SymptomsChart({ periods = [], topN = 5 }) {
  const top = getTopSymptoms(periods, topN);

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <Icon name="bar_chart" size={16} color="#a09488" />
        <p style={styles.headerLabel}>Most Common Symptoms</p>
        {periods.length > 0 && (
          <span style={styles.periodCount}>
            across {periods.length} period{periods.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Empty state */}
      {top.length === 0 && (
        <div style={styles.empty}>
          <Icon name="medical_information" size={28} color="#e0d9d2" style={{ marginBottom: 6 }} />
          <p>No symptoms logged yet.</p>
          <p style={styles.emptyHint}>Add symptoms when logging a period to see patterns here.</p>
        </div>
      )}

      {/* Bars */}
      {top.map((item, i) => (
        <div key={item.key} style={styles.row}>
          {/* Rank */}
          <span style={styles.rank}>{i + 1}</span>

          {/* Icon + label */}
          <div style={styles.labelGroup}>
            <Icon
              name={getSymptomIcon(item.key)}
              size={14}
              color="#c4837a"
            />
            <span style={styles.symptomLabel}>
              {getSymptomLabel(item.key)}
            </span>
          </div>

          {/* Bar + count */}
          <div style={styles.barWrap}>
            <div style={styles.barTrack}>
              <div
                style={{
                  ...styles.barFill,
                  width: `${item.pct}%`,
                  // Slightly lighter for lower ranks
                  opacity: 1 - i * 0.12,
                }}
              />
            </div>
            <span style={styles.count}>{item.count}×</span>
          </div>
        </div>
      ))}
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
    gap: 7,
    marginBottom: 14,
  },
  headerLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#a09488",
    flex: 1,
  },
  periodCount: {
    fontSize: 10,
    color: "#c8bfb5",
  },

  // Each symptom row
  row: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  rank: {
    fontSize: 10,
    color: "#c8bfb5",
    width: 12,
    textAlign: "right",
    flexShrink: 0,
  },
  labelGroup: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    width: 100,
    flexShrink: 0,
  },
  symptomLabel: {
    fontSize: 12,
    color: "#4a3f3a",
    textTransform: "capitalize",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  // Bar
  barWrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 7,
  },
  barTrack: {
    flex: 1,
    height: 5,
    background: "#f0ebe4",
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    background: "#c4837a",
    borderRadius: 3,
    transition: "width 0.4s ease",
  },
  count: {
    fontSize: 11,
    color: "#a09488",
    width: 24,
    textAlign: "right",
    flexShrink: 0,
  },

  // Empty state
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "16px 0 6px",
    color: "#b0a49a",
    fontSize: 12,
    textAlign: "center",
  },
  emptyHint: {
    fontSize: 11,
    color: "#c8bfb5",
    marginTop: 4,
    lineHeight: 1.4,
  },
};