import { useState } from "react";
import Icon from "../../common/Icon";
import { exportCSV, exportTXT } from "../../utils/exportUtils";
import { fmtDate } from "../../utils/dateUtils";

/**
 * Header
 *
 * Props:
 *  - periods       {Array}   all logged period entries
 *  - logs          {Array}   all logged lifestyle entries
 *  - avgCycle      {number}  average cycle gap in days
 *  - lastPeriod    {object|null} most recent period entry
 *  - onToast       {fn}      callback(message: string) to show a toast
 */
export default function Header({ periods, logs, avgCycle, lastPeriod, onToast }) {
  const [exportOpen, setExportOpen] = useState(false);

  // Days since last period started
  const today        = new Date().toISOString().split("T")[0];
  const daysSinceLast = lastPeriod
    ? Math.round((new Date(today) - new Date(lastPeriod.start)) / 86400000)
    : null;

  // Estimated days until next period (positive = future, negative = overdue)
  const nextEst = lastPeriod && avgCycle ? avgCycle - daysSinceLast : null;

  const handleExportCSV = () => {
    exportCSV(periods, logs);
    setExportOpen(false);
    onToast("CSV downloaded");
  };

  const handleExportTXT = () => {
    exportTXT(periods, logs, avgCycle);
    setExportOpen(false);
    onToast("Report downloaded");
  };

  return (
    <header style={styles.root}>

      {/* ── Top row: branding + export ── */}
      <div style={styles.topRow}>

        {/* Branding */}
        <div>
          <p style={styles.eyebrow}>Cycle Companion</p>
          <h1 style={styles.title}>
            Your Health<br />
            <em>Overview</em>
          </h1>
          <p style={styles.subtitle}>
            {periods.length > 0
              ? `${avgCycle}-day avg cycle · ${periods.length} periods logged`
              : "Start logging your cycle"}
          </p>
        </div>

        {/* Export button + dropdown */}
        <div style={styles.exportWrapper}>
          <button
            style={styles.exportBtn}
            onClick={() => setExportOpen((v) => !v)}
            aria-label="Export data"
          >
            <Icon name="file_download" size={16} color="#6a5f58" />
            <span>Export</span>
          </button>

          {exportOpen && (
            <div style={styles.dropdown}>
              <button style={styles.dropdownItem} onClick={handleExportCSV}>
                <Icon name="table_chart" size={16} color="#7a9ec4" />
                Export as CSV
              </button>
              <button style={styles.dropdownItem} onClick={handleExportTXT}>
                <Icon name="description" size={16} color="#6aab8e" />
                Export as Report
              </button>
            </div>
          )}

          {/* Click-away overlay to close dropdown */}
          {exportOpen && (
            <div
              style={styles.overlay}
              onClick={() => setExportOpen(false)}
            />
          )}
        </div>
      </div>

      {/* ── Next period estimate banner ── */}
      {lastPeriod && nextEst !== null && (
        <div
          style={{
            ...styles.banner,
            background: nextEst <= 3 ? "#fdf0ee" : "#f5f0ea",
          }}
        >
          <div style={styles.bannerLeft}>
            <Icon
              name={nextEst <= 0 ? "warning_amber" : "calendar_month"}
              size={18}
              color={nextEst <= 3 ? "#c4837a" : "#b5a66e"}
            />
            <div>
              <p style={styles.bannerLabel}>
                {nextEst <= 0 ? "Period may be late" : "Next period estimate"}
              </p>
              <p
                style={{
                  ...styles.bannerValue,
                  color: nextEst <= 3 ? "#c4837a" : "#2a2420",
                }}
              >
                {nextEst <= 0
                  ? `${Math.abs(nextEst)} day${Math.abs(nextEst) !== 1 ? "s" : ""} overdue`
                  : nextEst === 0
                  ? "Today"
                  : `In ${nextEst} day${nextEst !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
          <div style={styles.bannerRight}>
            <p style={styles.bannerLabel}>Last period</p>
            <p style={styles.bannerDate}>{fmtDate(lastPeriod.start)}</p>
          </div>
        </div>
      )}

      {/* ── Storage status pill ── */}
      <div style={styles.pill}>
        <Icon name="cloud_done" size={13} color="#6aab8e" />
        <span style={styles.pillText}>
          Saved · {periods.length} periods · {logs.length} logs
        </span>
      </div>
    </header>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  root: {
    padding: "28px 24px 0",
    maxWidth: 430,
    margin: "0 auto",
  },

  // Top row
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#a09488",
    marginBottom: 4,
  },
  title: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 28,
    fontWeight: 400,
    lineHeight: 1.2,
    color: "#2a2420",
  },
  subtitle: {
    fontSize: 12,
    color: "#a09488",
    marginTop: 6,
  },

  // Export
  exportWrapper: {
    position: "relative",
    marginTop: 6,
    zIndex: 200,
  },
  exportBtn: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "#fff",
    color: "#2a2420",
    border: "1.5px solid #e0d9d2",
    borderRadius: 8,
    padding: "7px 12px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    top: 40,
    right: 0,
    background: "#fff",
    border: "1px solid #e0d9d2",
    borderRadius: 10,
    boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
    minWidth: 175,
    overflow: "hidden",
    zIndex: 201,
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    background: "none",
    border: "none",
    textAlign: "left",
    padding: "11px 14px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    cursor: "pointer",
    color: "#2a2420",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 199,
  },

  // Banner
  banner: {
    marginTop: 14,
    borderRadius: 10,
    padding: "10px 14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  bannerLabel: {
    fontSize: 11,
    color: "#a09488",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  bannerValue: {
    fontSize: 14,
    fontWeight: 500,
    marginTop: 2,
  },
  bannerRight: {
    textAlign: "right",
  },
  bannerDate: {
    fontSize: 12,
    fontWeight: 500,
    marginTop: 2,
    color: "#2a2420",
  },

  // Pill
  pill: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    background: "#eef7f2",
    borderRadius: 6,
    padding: "4px 10px",
    width: "fit-content",
  },
  pillText: {
    fontSize: 11,
    color: "#4a7a62",
  },
};