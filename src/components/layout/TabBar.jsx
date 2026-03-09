import Icon from "../../common/Icon";

/**
 * TabBar — fixed bottom navigation
 *
 * Props:
 *  - activeTab   {string}  current active tab id: "period" | "lifestyle" | "insights"
 *  - onChange    {fn}      callback(tabId: string) when a tab is tapped
 */

const TABS = [
  { id: "period",    label: "Period",    icon: "water_drop"      },
  { id: "lifestyle", label: "Lifestyle", icon: "self_improvement" },
  { id: "insights",  label: "Insights",  icon: "bar_chart"        },
];

export default function TabBar({ activeTab, onChange }) {
  return (
    <nav style={styles.nav} aria-label="Main navigation">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            style={{
              ...styles.item,
              color: isActive ? "#c4837a" : "#a09488",
            }}
            onClick={() => onChange(tab.id)}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon
              name={tab.icon}
              size={22}
              color={isActive ? "#c4837a" : "#b0a49a"}
            />
            <span
              style={{
                ...styles.label,
                fontWeight: isActive ? 500 : 400,
              }}
            >
              {tab.label}
            </span>

            {/* Active indicator dot */}
            {isActive && <span style={styles.dot} />}
          </button>
        );
      })}
    </nav>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    background: "#ffffff",
    borderTop: "1px solid #f0ebe4",
    zIndex: 100,
    // Safe area inset for mobile notch devices
    paddingBottom: "env(safe-area-inset-bottom, 0px)",
  },

  item: {
    flex: 1,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 0 8px",
    gap: 3,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 10,
    letterSpacing: "0.5px",
    transition: "color 0.15s",
    WebkitTapHighlightColor: "transparent",
  },

  label: {
    fontSize: 10,
    letterSpacing: "0.4px",
    textTransform: "capitalize",
  },

  // Small dot under active tab label
  dot: {
    position: "absolute",
    bottom: 4,
    left: "50%",
    transform: "translateX(-50%)",
    width: 4,
    height: 4,
    borderRadius: "50%",
    background: "#c4837a",
  },
};