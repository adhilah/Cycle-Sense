import { useEffect, useState } from "react";
import Icon from "../../common/Icon";

/**
 * Toast — animated bottom notification popup
 *
 * Props:
 *  - message     {string|null}  text to display; falsy = hidden
 *  - duration    {number}       ms before auto-dismiss (default 2500)
 *  - onDismiss   {fn}           called when the toast finishes showing
 *
 * Usage in a parent component:
 *
 *   const [toast, setToast] = useState(null);
 *   const showToast = (msg) => setToast(msg);
 *
 *   <Toast message={toast} onDismiss={() => setToast(null)} />
 */
export default function Toast({ message, duration = 2500, onDismiss }) {
  const [visible, setVisible] = useState(false);

  // Trigger enter animation when message changes
  useEffect(() => {
    if (!message) return;

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      // Give the exit animation time to finish before clearing
      setTimeout(() => onDismiss?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration]);

  if (!message) return null;

  // Determine icon and color based on message content
  const isError   = message.toLowerCase().includes("error") || message.toLowerCase().includes("fail");
  const isDeleted = message.toLowerCase().includes("deleted") || message.toLowerCase().includes("cleared");
  const isDownload = message.toLowerCase().includes("download");

  const iconName = isError
    ? "error_outline"
    : isDeleted
    ? "delete_outline"
    : isDownload
    ? "file_download_done"
    : "check_circle";

  const iconColor = isError ? "#c4837a" : isDeleted ? "#b0a49a" : "#6aab8e";

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        ...styles.toast,
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(12px)",
      }}
    >
      <Icon name={iconName} size={15} color={iconColor} />
      <span style={styles.text}>{message}</span>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  toast: {
    // Positioning
    position: "fixed",
    bottom: 80,                        // above the TabBar (≈68px tall)
    left: "50%",

    // Layout
    display: "flex",
    alignItems: "center",
    gap: 7,
    whiteSpace: "nowrap",

    // Appearance
    background: "#2a2420",
    borderRadius: 20,
    padding: "9px 18px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.18)",

    // Transition (enter + exit)
    transition: "opacity 0.25s ease, transform 0.25s ease",

    // Stacking
    zIndex: 999,

    // Prevent layout shift
    pointerEvents: "none",
  },

  text: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: "#faf9f7",
    letterSpacing: "0.2px",
  },
};