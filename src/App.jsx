import { useState, useCallback } from "react";

// Layout
import Header  from "./components/layout/Header";
import TabBar  from "./components/layout/TabBar";
import Toast   from "./components/layout/Toast";

// Tabs
import PeriodTab    from "./components/period/PeriodTab";
import LifestyleTab from "./components/lifestyle/LifestyleTab";
import InsightsTab  from "./components/insights/InsightsTab";

// Hooks
import { usePeriods } from "./hooks/usePeriods";
import { useLogs }    from "./hooks/useLogs";

/**
 * App — root component for Cycle Companion.
 *
 * Responsibilities:
 *  - Owns the active tab state
 *  - Owns toast message state
 *  - Instantiates usePeriods and useLogs (single source of truth for data)
 *  - Passes derived stats + data down to Header, tabs, and InsightsTab
 *
 * Data flow:
 *   usePeriods → periods, stats  →  Header, PeriodTab, InsightsTab
 *   useLogs    → logs, averages  →  LifestyleTab, InsightsTab
 */
export default function App() {
  const [activeTab,  setActiveTab]  = useState("period");
  const [toastMsg,   setToastMsg]   = useState(null);

  // ── Data hooks ──────────────────────────────────────────────────────────────
  const {
    periods,
    addPeriod,
    updatePeriod,
    deletePeriod,
    stats: periodStats,
  } = usePeriods();

  const {
    logs,
    addLog,
    deleteLog,
    clearAll: clearAllLogs,
    averages: logAverages,
  } = useLogs();

  // ── Toast ───────────────────────────────────────────────────────────────────
  const showToast = useCallback((msg) => {
    setToastMsg(msg);
  }, []);

  const dismissToast = useCallback(() => {
    setToastMsg(null);
  }, []);

  // ── Period tab handlers (passed to PeriodTab as a thin adapter) ─────────────
  // PeriodTab calls onSave({ id, start, end, ... }) for both add + update
  const handlePeriodSave = useCallback(
    (entry) => {
      const exists = periods.some((p) => p.id === entry.id);
      exists ? updatePeriod(entry) : addPeriod(entry);
    },
    [periods, addPeriod, updatePeriod]
  );

  // ── Derived values for Header ───────────────────────────────────────────────
  const { avgCycle, lastPeriod } = periodStats;

  return (
    <div style={styles.shell}>

      {/* ── Fixed header ── */}
      <Header
        periods={periods}
        logs={logs}
        avgCycle={avgCycle}
        lastPeriod={lastPeriod}
        onToast={showToast}
      />

      {/* ── Scrollable page content ── */}
      <main style={styles.content}>

        {activeTab === "period" && (
          <PeriodTab
            onToast={showToast}
            // PeriodTab manages its own internal state but can also receive
            // external save/delete handlers if you want to centralise here.
            // Passing onPeriods allows App to stay in sync if needed.
            onPeriods={() => {}}
          />
        )}

        {activeTab === "lifestyle" && (
          <LifestyleTab
            onToast={showToast}
            onLogs={() => {}}
          />
        )}

        {activeTab === "insights" && (
          <InsightsTab
            periodStats={periodStats}
            logAverages={logAverages}
            lastPeriod={lastPeriod}
          />
        )}

      </main>

      {/* ── Bottom navigation ── */}
      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      {/* ── Toast notification ── */}
      <Toast
        message={toastMsg}
        onDismiss={dismissToast}
      />

    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  shell: {
    maxWidth:        430,
    margin:          "0 auto",
    minHeight:       "100dvh",
    background:      "#faf9f7",
    position:        "relative",
    fontFamily:      "'DM Sans', system-ui, sans-serif",
  },
  content: {
    padding:         "0 20px 88px",   // 88px = bottom nav height + breathing room
    paddingTop:      0,
  },
};