import { useState } from "react";
import LifestyleForm from "../lifestyle/LifestyleForm";
import LifestyleCard from "../lifestyle/LifestyleCard";
import PatternsPanel from "../lifestyle/PatternsPanel";
import Icon from "../../common/Icon";
import { useLogs } from "../../hooks/useLogs";

/**
 * LifestyleTab — full lifestyle tab.
 * Uses useLogs hook for localStorage-backed persistence.
 *
 * Props:
 *  - onToast  {fn}  callback(message) to show a global Toast
 */
export default function LifestyleTab({ onToast }) {
  const { logs, addLog, clearAll } = useLogs();
  const [showAll, setShowAll] = useState(false);

  const handleSave = (form) => {
    const today = new Date().toISOString().split("T")[0];
    const entry = {
      date:   today,
      ...form,
      weight: form.weight || (logs[0]?.weight ?? 58),
    };
    addLog(entry);
    onToast?.("Lifestyle log saved");
  };

  const handleClearAll = () => {
    if (!window.confirm("Clear all lifestyle logs? This cannot be undone.")) return;
    clearAll();
    onToast?.("All logs cleared");
  };

  const displayed = showAll ? logs : logs.slice(0, 5);

  return (
    <div>
      {/* Daily log form */}
      <LifestyleForm onSave={handleSave} />

      {/* Patterns */}
      <PatternsPanel logs={logs} />

      {/* Log history header */}
      <div style={styles.historyHeader}>
        <div style={styles.historyTitle}>
          <Icon name="list_alt" size={16} color="#a09488" />
          <p style={styles.historyLabel}>
            Recent Logs
            <span style={styles.countBadge}> ({logs.length})</span>
          </p>
        </div>
        {logs.length > 0 && (
          <button style={styles.clearBtn} onClick={handleClearAll}>
            Clear all
          </button>
        )}
      </div>

      {/* Empty state */}
      {logs.length === 0 && (
        <div style={styles.empty}>
          <Icon name="inbox" size={28} color="#d5cec8" style={{ marginBottom: 8 }} />
          <p>No logs yet. Start by saving today's data above.</p>
        </div>
      )}

      {/* Cards */}
      {displayed.map((log, i) => (
        <LifestyleCard key={i} log={log} />
      ))}

      {/* Show more / less toggle */}
      {logs.length > 5 && (
        <button style={styles.toggleBtn} onClick={() => setShowAll((v) => !v)}>
          <Icon
            name={showAll ? "expand_less" : "expand_more"}
            size={16}
            color="#a09488"
          />
          {showAll ? "Show less" : `Show ${logs.length - 5} more`}
        </button>
      )}
    </div>
  );
}

const styles = {
  historyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  historyTitle: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  historyLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#a09488",
  },
  countBadge: {
    color: "#c8bfb5",
  },
  clearBtn: {
    background: "none",
    border: "none",
    color: "#c4837a",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    cursor: "pointer",
    textDecoration: "underline",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "32px 0",
    color: "#b0a49a",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 1.5,
  },
  toggleBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    width: "100%",
    background: "none",
    border: "1px solid #e8e2db",
    borderRadius: 8,
    padding: "8px 0",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    color: "#a09488",
    cursor: "pointer",
    marginTop: 4,
  },
};