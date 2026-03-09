import Icon from "../../common/Icon";
import { fmtDate, daysBetween } from "../../utils/dateUtils";

/**
 * PeriodCard — displays a single period log entry.
 *
 * Props:
 *  - period    {object}  { id, start, end, flow, symptoms, notes }
 *  - onEdit    {fn}      callback(period) when edit is tapped
 *  - onDelete  {fn}      callback(id) when delete is tapped
 */

const FLOW_COLOR = {
  spotting: { dot: "#d4c5b8", bg: "#f0ebe4", text: "#7a6a60" },
  light:    { dot: "#e8c8c4", bg: "#faeae8", text: "#9a5a54" },
  medium:   { dot: "#d4857d", bg: "#f5d8d5", text: "#8a3f38" },
  heavy:    { dot: "#b85a52", bg: "#edc8c4", text: "#7a2a24" },
};

const FLOW_LABEL = {
  spotting: "Spotting",
  light:    "Light",
  medium:   "Medium",
  heavy:    "Heavy",
};

export default function PeriodCard({ period, onEdit, onDelete }) {
  const { id, start, end, flow, symptoms = [], notes } = period;

  const flowStyle = FLOW_COLOR[flow] || FLOW_COLOR.light;
  const duration  = end ? daysBetween(start, end) + 1 : null;

  const handleDelete = () => {
    if (window.confirm("Delete this period entry?")) onDelete(id);
  };

  return (
    <div style={styles.card}>
      <div style={styles.topRow}>

        {/* Left: date range + badges */}
        <div style={styles.left}>

          {/* Flow dot + date */}
          <div style={styles.dateRow}>
            <span
              style={{
                ...styles.flowDot,
                background: flowStyle.dot,
              }}
            />
            <span style={styles.startDate}>{fmtDate(start)}</span>

            {end && (
              <>
                <Icon name="arrow_forward" size={12} color="#b0a49a" />
                <span style={styles.endDate}>{fmtDate(end)}</span>
              </>
            )}

            {!end && (
              <span style={styles.ongoingBadge}>Ongoing</span>
            )}
          </div>

          {/* Badges row */}
          <div style={styles.badgeRow}>
            {duration && (
              <span style={styles.badge}>{duration}d</span>
            )}
            <span
              style={{
                ...styles.badge,
                background: flowStyle.bg,
                color: flowStyle.text,
              }}
            >
              {FLOW_LABEL[flow]}
            </span>

            {symptoms.slice(0, 3).map((s) => (
              <span key={s} style={styles.badge}>
                {s}
              </span>
            ))}

            {symptoms.length > 3 && (
              <span style={styles.moreBadge}>+{symptoms.length - 3}</span>
            )}
          </div>

          {/* Notes */}
          {notes ? (
            <p style={styles.notes}>{notes}</p>
          ) : null}
        </div>

        {/* Right: action buttons */}
        <div style={styles.actions}>
          <button
            style={styles.iconBtn}
            onClick={() => onEdit(period)}
            aria-label="Edit period entry"
          >
            <Icon name="edit" size={17} color="#a09488" />
          </button>
          <button
            style={styles.iconBtn}
            onClick={handleDelete}
            aria-label="Delete period entry"
          >
            <Icon name="delete_outline" size={17} color="#c4837a" />
          </button>
        </div>
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
    alignItems: "flex-start",
    gap: 8,
  },
  left: {
    flex: 1,
    minWidth: 0,
  },

  // Date row
  dateRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
    marginBottom: 7,
  },
  flowDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    border: "1.5px solid #c4837a",
    flexShrink: 0,
  },
  startDate: {
    fontSize: 13,
    fontWeight: 500,
    color: "#2a2420",
  },
  endDate: {
    fontSize: 12,
    color: "#a09488",
  },
  ongoingBadge: {
    fontSize: 11,
    color: "#4a7a62",
    background: "#eef7f2",
    borderRadius: 4,
    padding: "1px 7px",
    fontWeight: 500,
  },

  // Badges
  badgeRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 5,
  },
  badge: {
    fontSize: 11,
    color: "#7a6056",
    background: "#f5ede8",
    borderRadius: 4,
    padding: "2px 7px",
    textTransform: "capitalize",
  },
  moreBadge: {
    fontSize: 11,
    color: "#a09488",
    padding: "2px 4px",
  },

  // Notes
  notes: {
    fontSize: 11,
    color: "#a09488",
    fontStyle: "italic",
    marginTop: 5,
    lineHeight: 1.4,
  },

  // Action buttons
  actions: {
    display: "flex",
    gap: 2,
    flexShrink: 0,
  },
  iconBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 5,
    borderRadius: 6,
  },
};