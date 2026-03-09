import Icon from "../../common/Icon";
import { buildChartPoints, buildPathD, buildAreaD, isIrregular } from "../../utils/cycleUtils";

/**
 * CycleChart — SVG area line chart showing cycle gap trend.
 *
 * Props:
 *  - gaps        {number[]}  cycle gap values in days (from usePeriods stats)
 *  - periods     {object[]}  raw period entries, used to derive month labels
 */

const CHART_W = 280;
const CHART_H = 76;
const PADDING = 4;

export default function CycleChart({ gaps = [], periods = [] }) {
  if (gaps.length < 2) {
    return (
      <div style={styles.card}>
        <div style={styles.header}>
          <Icon name="show_chart" size={16} color="#a09488" />
          <p style={styles.headerLabel}>Cycle Gap Trend</p>
        </div>
        <div style={styles.empty}>
          <Icon name="bar_chart" size={28} color="#e0d9d2" style={{ marginBottom: 6 }} />
          <p>Log at least 2 periods to see your trend.</p>
        </div>
      </div>
    );
  }

  // Use last 6 gaps
  const visibleGaps = gaps.slice(-6);

  const points  = buildChartPoints(visibleGaps, CHART_W, CHART_H, PADDING);
  const lineD   = buildPathD(points);
  const areaD   = buildAreaD(lineD, points, CHART_H);
  const irregular = isIrregular(visibleGaps);

  // Month labels: align with the sorted ascending period starts
  const sortedPeriods = [...periods]
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(-6);                               // same window as gaps

  const monthLabel = (index) => {
    const p = sortedPeriods[index + 1];       // gap[i] is between period[i] and period[i+1]
    if (!p) return "";
    return new Date(p.start + "T00:00:00").toLocaleDateString("en-GB", {
      month: "short",
    });
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <Icon name="show_chart" size={16} color="#a09488" />
        <p style={styles.headerLabel}>Cycle Gap Trend</p>
        <span style={styles.unitHint}>(days)</span>
      </div>

      {/* SVG chart */}
      <svg
        width="100%"
        viewBox={`-10 -14 ${CHART_W + 20} ${CHART_H + 28}`}
        style={{ overflow: "visible" }}
        aria-label="Cycle gap trend chart"
        role="img"
      >
        {/* Subtle grid lines at min, mid, max */}
        {[points[0], points[Math.floor(points.length / 2)], points[points.length - 1]].map(
          (p, i) => (
            <line
              key={i}
              x1={0}
              y1={p?.y ?? 0}
              x2={CHART_W}
              y2={p?.y ?? 0}
              stroke="#f0ebe4"
              strokeWidth={1}
            />
          )
        )}

        {/* Area fill */}
        <path d={areaD} fill="#f5f0ea" />

        {/* Line */}
        <path
          d={lineD}
          fill="none"
          stroke="#c4837a"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Points + value labels + month labels */}
        {points.map((pt, i) => (
          <g key={i}>
            {/* Value label above dot */}
            <text
              x={pt.x}
              y={pt.y - 8}
              textAnchor="middle"
              fontSize={9}
              fill="#7a6056"
              fontFamily="DM Sans, sans-serif"
            >
              {pt.v}d
            </text>

            {/* Dot */}
            <circle cx={pt.x} cy={pt.y} r={4} fill="#c4837a" />

            {/* Month label below */}
            <text
              x={pt.x}
              y={CHART_H + 14}
              textAnchor="middle"
              fontSize={9}
              fill="#b0a49a"
              fontFamily="DM Sans, sans-serif"
            >
              {monthLabel(i)}
            </text>
          </g>
        ))}
      </svg>

      {/* Insight note */}
      <div style={styles.note}>
        <Icon
          name={irregular ? "warning_amber" : "check_circle"}
          size={14}
          color={irregular ? "#c4837a" : "#6aab8e"}
        />
        <p style={{ ...styles.noteText, color: irregular ? "#c4837a" : "#b0a49a" }}>
          {irregular
            ? "High variability detected. Consider speaking with your doctor."
            : "Moderate variability — common with irregular cycles."}
        </p>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  card: {
    background: "#ffffff",
    border: "1px solid #f0ebe4",
    borderRadius: 14,
    padding: "18px 20px",
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
  unitHint: {
    fontSize: 10,
    color: "#c8bfb5",
  },
  note: {
    display: "flex",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 10,
  },
  noteText: {
    fontSize: 11,
    lineHeight: 1.4,
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 0 8px",
    color: "#b0a49a",
    fontSize: 12,
    textAlign: "center",
    gap: 4,
  },
};