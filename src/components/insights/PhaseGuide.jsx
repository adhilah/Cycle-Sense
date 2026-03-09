import { useState } from "react";
import Icon from "../../common/Icon";
import { PHASES } from "../../constants/phases";
import { getCurrentPhase } from "../../utils/cycleUtils";

/**
 * PhaseGuide — interactive 4-phase grid with selectable self-care tips.
 *
 * Shows the current phase (if last period data exists) with a highlight badge.
 * Tapping a phase card selects it and shows its tips below.
 *
 * Props:
 *  - lastPeriod  {object|null}  most recent period entry { start }
 */

export default function PhaseGuide({ lastPeriod = null }) {
  const currentPhase = getCurrentPhase(lastPeriod);
  const [selected, setSelected]  = useState(currentPhase?.name ?? "Luteal");

  const activePhase = PHASES.find((p) => p.name === selected) ?? PHASES[3];

  return (
    <div>
      {/* Section label */}
      <div style={styles.sectionRow}>
        <Icon name="cycle" size={16} color="#a09488" />
        <p style={styles.sectionLabel}>Cycle Phases</p>
        {currentPhase && (
          <span style={styles.currentBadge}>
            <span
              style={{
                ...styles.currentDot,
                background: currentPhase.dot,
              }}
            />
            Now: {currentPhase.name}
          </span>
        )}
      </div>

      {/* 2×2 Phase grid */}
      <div style={styles.grid}>
        {PHASES.map((ph) => {
          const isSelected = selected === ph.name;
          const isCurrent  = currentPhase?.name === ph.name;

          return (
            <button
              key={ph.name}
              style={{
                ...styles.phaseCard,
                background: ph.color,
                outline: isSelected
                  ? `2px solid ${ph.dot}`
                  : "2px solid transparent",
              }}
              onClick={() => setSelected(ph.name)}
              aria-pressed={isSelected}
            >
              {/* Current indicator */}
              {isCurrent && (
                <span style={{ ...styles.nowDot, background: ph.dot }} />
              )}

              <div style={styles.phaseTop}>
                <Icon name={ph.icon} size={16} color={ph.dot} />
                <span style={styles.phaseName}>{ph.name}</span>
              </div>
              <div style={styles.phaseDays}>{ph.days}</div>
              {isSelected && (
                <div style={{ ...styles.activeBar, background: ph.dot }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Tips panel */}
      <div style={styles.tipsCard}>
        {/* Tips header */}
        <div style={styles.tipsHeader}>
          <div
            style={{
              ...styles.tipsDot,
              background: activePhase.dot,
            }}
          />
          <p style={styles.tipsTitle}>{activePhase.name} Phase</p>
          <span style={styles.tipsDays}>{activePhase.days}</span>
        </div>

        {/* Summary */}
        <p style={styles.tipsSummary}>{activePhase.summary}</p>

        {/* Tip list */}
        <div style={styles.tipsList}>
          {activePhase.tips.map((tip, i) => (
            <div key={i} style={styles.tipRow}>
              <div
                style={{
                  ...styles.tipBullet,
                  background: activePhase.dot,
                }}
              />
              <p style={styles.tipText}>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  // Section row
  sectionRow: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#a09488",
    flex: 1,
  },
  currentBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    color: "#6a5f58",
    background: "#f5f0ea",
    borderRadius: 4,
    padding: "2px 8px",
  },
  currentDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    flexShrink: 0,
  },

  // Phase grid
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginBottom: 14,
  },
  phaseCard: {
    position: "relative",
    borderRadius: 12,
    padding: "14px 14px 12px",
    cursor: "pointer",
    border: "none",
    textAlign: "left",
    transition: "transform 0.15s, box-shadow 0.15s",
    fontFamily: "'DM Sans', sans-serif",
  },
  nowDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: "50%",
  },
  phaseTop: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 5,
  },
  phaseName: {
    fontSize: 13,
    fontWeight: 500,
    color: "#2a2420",
  },
  phaseDays: {
    fontSize: 10,
    color: "#6a5f58",
  },
  activeBar: {
    marginTop: 8,
    height: 2,
    borderRadius: 1,
    width: "40%",
  },

  // Tips panel
  tipsCard: {
    background: "#ffffff",
    border: "1px solid #f0ebe4",
    borderRadius: 14,
    padding: "16px 18px",
    marginBottom: 20,
  },
  tipsHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  tipsDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: "#2a2420",
    flex: 1,
  },
  tipsDays: {
    fontSize: 11,
    color: "#a09488",
  },
  tipsSummary: {
    fontSize: 12,
    color: "#6a5f58",
    lineHeight: 1.5,
    marginBottom: 12,
    fontStyle: "italic",
  },
  tipsList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  tipRow: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
  },
  tipBullet: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    marginTop: 6,
    flexShrink: 0,
  },
  tipText: {
    fontSize: 13,
    color: "#4a3f3a",
    lineHeight: 1.5,
  },
};