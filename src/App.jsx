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
 * usePeriods and useLogs are instantiated here so Header and
 * InsightsTab always have up-to-date data from localStorage.
 */
export default function App() {
  const [activeTab, setActiveTab] = useState("period");
  const [toastMsg,  setToastMsg]  = useState(null);

  const { periods, stats: periodStats } = usePeriods();
  const { logs,    averages: logAverages } = useLogs();

  const showToast    = useCallback((msg) => setToastMsg(msg), []);
  const dismissToast = useCallback(() => setToastMsg(null), []);

  const { avgCycle, lastPeriod } = periodStats;

  return (
    <div style={styles.shell}>

      <Header
        periods={periods}
        logs={logs}
        avgCycle={avgCycle}
        lastPeriod={lastPeriod}
        onToast={showToast}
      />

      <main style={styles.content}>
        {activeTab === "period"    && <PeriodTab    onToast={showToast} />}
        {activeTab === "lifestyle" && <LifestyleTab onToast={showToast} />}
        {activeTab === "insights"  && (
          <InsightsTab
            periodStats={periodStats}
            logAverages={logAverages}
            lastPeriod={lastPeriod}
          />
        )}
      </main>

      <TabBar activeTab={activeTab} onChange={setActiveTab} />
      <Toast  message={toastMsg}   onDismiss={dismissToast} />
    </div>
  );
}

const styles = {
  shell: {
    maxWidth:   430,
    margin:     "0 auto",
    minHeight:  "100dvh",
    background: "#faf9f7",
    position:   "relative",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  content: {
    padding: "0 20px 88px",
  },
};