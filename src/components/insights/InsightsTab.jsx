import StatCards from "./StatCards";
import CycleChart from "./CycleChart";
import SymptomsChart from "./SymptomsChart";
import PhaseGuide from "./PhaseGuide";
import Icon from "../../common/Icon";

/**
 * InsightsTab — full Insights tab.
 *
 * Composes:
 *   StatCards      → avg cycle / duration / variability
 *   Lifestyle strip → avg stress, sleep, log count (from useLogs)
 *   CycleChart     → cycle gap SVG trend line
 *   SymptomsChart  → top symptoms horizontal bar chart
 *   PhaseGuide     → interactive phase cards + self-care tips
 *
 * Props:
 *  - periodStats  {object}  from usePeriods().stats
 *  - logAverages  {object}  from useLogs().averages
 *  - lastPeriod   {object|null}
 */
export default function InsightsTab({ periodStats = {}, logAverages = {}, lastPeriod = null }) {
  const {
    gaps            = [],
    symptomFrequency = {},
    count           = 0,
  } = periodStats;

  const {
    stress:   avgStress   = null,
    sleep:    avgSleep    = null,
    count:    logCount    = 0,
  } = logAverages;

  return (
    <div>

      {/* ── Stat cards: avg cycle / duration / variability ── */}
      <StatCards stats={periodStats} />

      {/* ── Lifestyle averages strip ── */}
      {logCount > 0 && (
        <div style={styles.lifestyleCard}>
          <div style={styles.cardHeader}>
            <Icon name="analytics" size={16} color="#a09488" />
            <p style={styles.cardLabel}>Lifestyle Averages</p>
          </div>
          <div style={styles.lifestyleRow}>
            {[
              {
                label: "Avg Stress",
                value: avgStress !== null ? `${avgStress}/10` : "—",
                color: "#c4837a",
                icon:  "sentiment_dissatisfied",
              },
              {
                label: "Avg Sleep",
                value: avgSleep !== null ? `${avgSleep}h` : "—",
                color: "#6aab8e",
                icon:  "bedtime",
              },
              {
                label: "Log Entries",
                value: logCount,
                color: "#7a9ec4",
                icon:  "list_alt",
              },
            ].map((s) => (
              <div key={s.label} style={styles.lifestyleStat}>
                <div style={styles.lifestyleValueRow}>
                  <Icon name={s.icon} size={14} color={s.color} />
                  <span
                    style={{
                      ...styles.lifestyleValue,
                      color: s.color,
                    }}
                  >
                    {s.value}
                  </span>
                </div>
                <span style={styles.lifestyleLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Cycle gap trend chart ── */}
      <CycleChart gaps={gaps} />

      {/* ── Top symptoms chart ── */}
      {count > 0 && (
        <SymptomsChart
          symptomFrequency={symptomFrequency}
          periodCount={count}
          topN={6}
        />
      )}

      {/* ── Phase guide ── */}
      <PhaseGuide lastPeriod={lastPeriod} />

    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  // Lifestyle averages card
  lifestyleCard: {
    background: "#ffffff",
    border: "1px solid #f0ebe4",
    borderRadius: 14,
    padding: "14px 18px",
    marginBottom: 20,
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#a09488",
  },
  lifestyleRow: {
    display: "flex",
    gap: 24,
  },
  lifestyleStat: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  lifestyleValueRow: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  lifestyleValue: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 20,
    lineHeight: 1,
  },
  lifestyleLabel: {
    fontSize: 10,
    color: "#a09488",
    letterSpacing: 0.3,
  },
};