import { useState, useEffect } from "react";
import LifestyleForm from "./LifestyleForm";
import LifestyleCard from "./LifestyleCard";
import PatternsPanel from "./PatternsPanel";
import Icon from "../../common/Icon";

const LOGS_KEY    = "cc-lifestyle-logs";
const SAMPLE_LOGS = [
  { date: "2026-03-01", stress: 7, sleep: 6, exercise: 30, diet: "good",  weight: 58.2 },
  { date: "2026-02-22", stress: 4, sleep: 8, exercise: 45, diet: "great", weight: 57.9 },
  { date: "2026-02-14", stress: 8, sleep: 5, exercise: 0,  diet: "poor",  weight: 58.5 },
  { date: "2026-02-07", stress: 3, sleep: 7, exercise: 60, diet: "great", weight: 57.7 },
];

/**
 * LifestyleTab — full lifestyle tab:
 *   LifestyleForm  →  save daily log
 *   PatternsPanel  →  detected lifestyle/cycle correlations
 *   Log history    →  list of LifestyleCards
 *
 * Props:
 *  - onToast  {fn}       callback(message) to show a global Toast
 *  - onLogs   {fn}       optional callback(logs) to bubble logs up to App
 */
export default function LifestyleTab({ onToast, onLogs }) {
  const [logs,         setLogs]         = useState([]);
  const [storageReady, setStorageReady] = useState(false);
  const [showAll,      setShowAll]      = useState(false);

  // ── Load from storage on mount ──────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const result = await window.storage.get(LOGS_KEY);
        setLogs(result ? JSON.parse(result.value) : SAMPLE_LOGS);
      } catch {
        setLogs(SAMPLE_LOGS);
      }
      setStorageReady(true);
    }
    load();
  }, []);

  // ── Persist on every change ─────────────────────────────────────────────────
  useEffect(() => {
    if (!storageReady) return;
    window.storage.set(LOGS_KEY, JSON.stringify(logs)).catch(() => {});
    onLogs?.(logs);
  }, [logs, storageReady]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSave = (form) => {
    const today = new Date().toISOString().split("T")[0];
    const entry = {
      date:   today,
      ...form,
      weight: form.weight || (logs[0]?.weight ?? 58),
    };
    setLogs((prev) =>
      prev[0]?.date === today ? [entry, ...prev.slice(1)] : [entry, ...prev]
    );
    onToast?.("Lifestyle log saved");
  };

  const handleClearAll = async () => {
    if (!window.confirm("Clear all lifestyle logs? This cannot be undone.")) return;
    setLogs([]);
    try { await window.storage.delete(LOGS_KEY); } catch {}
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

// ── Styles ────────────────────────────────────────────────────────────────────

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