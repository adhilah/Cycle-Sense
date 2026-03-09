import { useState, useEffect } from "react";
import PeriodForm from "./PeriodForm";
import PeriodCard from "./PeriodCard";
import Icon from "../../common/Icon";
import { daysBetween } from "../../utils/dateUtils";

const PERIODS_KEY = "cc-period-logs";

const SAMPLE_PERIODS = [
  { id: 1, start: "2026-01-28", end: "2026-02-01", flow: "medium", symptoms: ["cramps", "bloating"], notes: "Started on time" },
  { id: 2, start: "2025-12-21", end: "2025-12-26", flow: "heavy", symptoms: ["cramps", "headache"], notes: "Heavier than usual" },
  { id: 3, start: "2025-11-09", end: "2025-11-13", flow: "light", symptoms: ["fatigue"], notes: "" },
  { id: 4, start: "2025-10-02", end: "2025-10-06", flow: "medium", symptoms: ["bloating", "moodswings"], notes: "" },
];

export default function PeriodTab({ onToast, onPeriods }) {
  const [periods, setPeriods] = useState([]);
  const [editEntry, setEditEntry] = useState(null);
  const [storageReady, setStorageReady] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // ── Load from storage ─────────────────────────────────
  useEffect(() => {
    try {
      const result = localStorage.getItem(PERIODS_KEY);
      setPeriods(result ? JSON.parse(result) : SAMPLE_PERIODS);
    } catch {
      setPeriods(SAMPLE_PERIODS);
    }
    setStorageReady(true);
  }, []);

  // ── Persist on change ─────────────────────────────────
  useEffect(() => {
    if (!storageReady) return;

    try {
      localStorage.setItem(PERIODS_KEY, JSON.stringify(periods));
    } catch {}

    onPeriods?.(periods);
  }, [periods, storageReady]);

  // ── Derived stats ─────────────────────────────────────
  const sorted = [...periods].sort((a, b) => a.start.localeCompare(b.start));
  const gaps = [];

  for (let i = 1; i < sorted.length; i++) {
    gaps.push(daysBetween(sorted[i - 1].start, sorted[i].start));
  }

  const avgCycle = gaps.length
    ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length)
    : null;

  // ── CRUD handlers ─────────────────────────────────────
  const handleSave = (entry) => {
    setPeriods((prev) =>
      [entry, ...prev.filter((p) => p.id !== entry.id)].sort(
        (a, b) => b.start.localeCompare(a.start)
      )
    );

    setEditEntry(null);
    onToast?.(editEntry ? "Period updated" : "Period saved");
  };

  const handleEdit = (period) => {
    setEditEntry(period);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    setPeriods((prev) => prev.filter((p) => p.id !== id));
    onToast?.("Entry deleted");
  };

  const handleCancel = () => setEditEntry(null);

  const displayed = showAll ? periods : periods.slice(0, 5);

  return (
    <div>
      <PeriodForm
        editEntry={editEntry}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      {periods.length >= 2 && (
        <div style={styles.statsStrip}>
          {[
            {
              icon: "loop",
              label: "Avg cycle",
              value: avgCycle ? `${avgCycle}d` : "—",
              color: "#c4837a",
            },
            {
              icon: "straighten",
              label: "Periods",
              value: periods.length,
              color: "#7a9ec4",
            },
            {
              icon: "event_available",
              label: "Latest",
              value: periods[0]
                ? new Date(periods[0].start + "T00:00:00").toLocaleDateString(
                    "en-GB",
                    { day: "numeric", month: "short" }
                  )
                : "—",
              color: "#6aab8e",
            },
          ].map((s) => (
            <div key={s.label} style={styles.statCell}>
              <Icon name={s.icon} size={16} color={s.color} />
              <span style={{ ...styles.statValue, color: s.color }}>
                {s.value}
              </span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      <div style={styles.historyHeader}>
        <div style={styles.historyTitle}>
          <Icon name="history" size={16} color="#a09488" />
          <p style={styles.historyLabel}>
            Period History
            <span style={styles.countBadge}> ({periods.length})</span>
          </p>
        </div>
      </div>

      {periods.length === 0 && (
        <div style={styles.empty}>
          <Icon
            name="water_drop"
            size={32}
            color="#e0d9d2"
            style={{ marginBottom: 10 }}
          />
          <p>No periods logged yet.</p>
          <p style={styles.emptyHint}>
            Use the form above to add your first entry.
          </p>
        </div>
      )}

      {displayed.map((p) => (
        <PeriodCard
          key={p.id}
          period={p}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

      {periods.length > 5 && (
        <button
          style={styles.toggleBtn}
          onClick={() => setShowAll((v) => !v)}
        >
          <Icon
            name={showAll ? "expand_less" : "expand_more"}
            size={16}
            color="#a09488"
          />
          {showAll ? "Show less" : `Show ${periods.length - 5} more`}
        </button>
      )}
    </div>
  );
}

const styles = {
  statsStrip: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 10,
    marginBottom: 20,
  },
  statCell: {
    background: "#ffffff",
    border: "1px solid #f0ebe4",
    borderRadius: 12,
    padding: "12px 10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
  },
  statValue: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 20,
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 10,
    color: "#a09488",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
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
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "36px 0 24px",
    color: "#b0a49a",
    fontSize: 13,
    textAlign: "center",
  },
  emptyHint: {
    fontSize: 12,
    color: "#c8bfb5",
    marginTop: 4,
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