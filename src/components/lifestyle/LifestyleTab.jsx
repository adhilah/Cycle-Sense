import { useState, useMemo } from "react";
import Icon from "../../common/Icon";
import { useStorage } from "../../hooks/useStorage";

// ── Storage keys ──────────────────────────────────────────────────────────────
const HABITS_KEY      = "cc-habits";
const COMPLETIONS_KEY = "cc-habit-completions";

// ── Default habits ────────────────────────────────────────────────────────────
const DEFAULT_HABITS = [
  { id: "water",    label: "Drink 8 glasses of water", icon: "water_drop",     color: "#7a9ec4" },
  { id: "vitamins", label: "Take vitamins / iron",     icon: "medication",     color: "#6aab8e" },
  { id: "walk",     label: "20 min walk outside",      icon: "directions_walk",color: "#b5a66e" },
  { id: "sleep",    label: "In bed by 11 PM",          icon: "bedtime",        color: "#9b7ec4" },
  { id: "journal",  label: "Write in journal",         icon: "edit_note",      color: "#c4837a" },
  { id: "nosugar",  label: "Avoid processed sugar",    icon: "no_food",        color: "#b85a52" },
  { id: "stretch",  label: "Stretch / yoga",           icon: "self_improvement",color: "#6aab8e"},
  { id: "screens",  label: "No screens after 10 PM",   icon: "mobile_off",     color: "#7a9ec4" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getWeekDays() {
  // Returns last 7 days as "YYYY-MM-DD" strings, oldest first
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function shortDay(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short" }).slice(0, 2);
}

function calcStreak(habitId, completions) {
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = d.toISOString().split("T")[0];
    if (completions[key]?.[habitId]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return streak;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function LifestyleTab({ onToast }) {
  const { value: habits,      setValue: setHabits }      = useStorage(HABITS_KEY,      DEFAULT_HABITS);
  const { value: completions, setValue: setCompletions } = useStorage(COMPLETIONS_KEY, {});

  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel,    setNewLabel]    = useState("");
  const [activeHabit, setActiveHabit] = useState(null); // for week detail view

  const weekDays = useMemo(() => getWeekDays(), []);
  const todayStr = today();

  // ── Toggle a habit complete for a given date ────────────────────────────────
  const toggleHabit = (habitId, date) => {
    setCompletions((prev) => {
      const dayMap = { ...(prev[date] || {}) };
      dayMap[habitId] = !dayMap[habitId];
      return { ...prev, [date]: dayMap };
    });
  };

  // ── Add custom habit ────────────────────────────────────────────────────────
  const handleAddHabit = () => {
    if (!newLabel.trim()) return;
    const id = "custom_" + Date.now();
    setHabits((prev) => [...prev, { id, label: newLabel.trim(), icon: "check_circle", color: "#c4837a" }]);
    setNewLabel("");
    setShowAddForm(false);
    onToast?.("Habit added");
  };

  // ── Remove habit ────────────────────────────────────────────────────────────
  const handleRemoveHabit = (habitId) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    onToast?.("Habit removed");
  };

  // ── Today's completion count ────────────────────────────────────────────────
  const todayCount   = habits.filter((h) => completions[todayStr]?.[h.id]).length;
  const totalHabits  = habits.length;
  const progressPct  = totalHabits > 0 ? Math.round((todayCount / totalHabits) * 100) : 0;

  return (
    <div>

      {/* ── Today's Progress Card ── */}
      <div style={styles.progressCard}>
        <div style={styles.progressHeader}>
          <div>
            <p style={styles.progressTitle}>Today's Habits</p>
            <p style={styles.progressSub}>
              {todayCount} of {totalHabits} completed
            </p>
          </div>
          <div style={styles.progressCircle}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="22" fill="none" stroke="#f0ebe4" strokeWidth="4" />
              <circle
                cx="26" cy="26" r="22"
                fill="none"
                stroke="#c4837a"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - progressPct / 100)}`}
                transform="rotate(-90 26 26)"
              />
            </svg>
            <span style={styles.progressPct}>{progressPct}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={styles.progressBarBg}>
          <div style={{ ...styles.progressBarFill, width: `${progressPct}%` }} />
        </div>
      </div>

      {/* ── Habit List ── */}
      <div style={styles.sectionHeader}>
        <div style={styles.sectionTitle}>
          <Icon name="checklist" size={16} color="#a09488" />
          <p style={styles.sectionLabel}>Habits</p>
        </div>
        <button style={styles.addBtn} onClick={() => setShowAddForm((v) => !v)}>
          <Icon name={showAddForm ? "close" : "add"} size={16} color="#faf9f7" />
          {showAddForm ? "Cancel" : "Add habit"}
        </button>
      </div>

      {/* Add habit form */}
      {showAddForm && (
        <div style={styles.addForm}>
          <input
            type="text"
            value={newLabel}
            placeholder="e.g. Drink herbal tea"
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddHabit()}
            style={styles.addInput}
            autoFocus
          />
          <button style={styles.addConfirmBtn} onClick={handleAddHabit}>
            Add
          </button>
        </div>
      )}

      {/* Habit rows */}
      {habits.map((habit) => {
        const doneToday = completions[todayStr]?.[habit.id] || false;
        const streak    = calcStreak(habit.id, completions);

        return (
          <div
            key={habit.id}
            style={{
              ...styles.habitRow,
              background: doneToday ? habit.color + "12" : "#ffffff",
              borderColor: doneToday ? habit.color + "55" : "#f0ebe4",
            }}
          >
            {/* Check button */}
            <button
              style={{
                ...styles.checkBtn,
                background:   doneToday ? habit.color : "#f5f0ea",
                borderColor:  doneToday ? habit.color : "#e0d9d2",
              }}
              onClick={() => toggleHabit(habit.id, todayStr)}
            >
              {doneToday && <Icon name="check" size={16} color="#fff" />}
            </button>

            {/* Label + streak */}
            <div style={styles.habitInfo}>
              <div style={styles.habitLabelRow}>
                <Icon name={habit.icon} size={15} color={habit.color} />
                <span style={{
                  ...styles.habitLabel,
                  color:          doneToday ? habit.color : "#2a2420",
                  textDecoration: doneToday ? "line-through" : "none",
                  opacity:        doneToday ? 0.7 : 1,
                }}>
                  {habit.label}
                </span>
              </div>
              {streak > 0 && (
                <span style={styles.streak}>
                  <Icon name="local_fire_department" size={11} color="#c4837a" />
                  {streak} day streak
                </span>
              )}
            </div>

            {/* Week dots */}
            <div style={styles.weekDots}>
              {weekDays.map((day) => {
                const done = completions[day]?.[habit.id];
                const isToday = day === todayStr;
                return (
                  <button
                    key={day}
                    title={day}
                    style={{
                      ...styles.weekDot,
                      background:  done ? habit.color : "#f0ebe4",
                      borderColor: isToday ? habit.color : "transparent",
                      borderWidth: isToday ? 2 : 0,
                      borderStyle: "solid",
                    }}
                    onClick={() => toggleHabit(habit.id, day)}
                  />
                );
              })}
            </div>

            {/* Delete */}
            <button
              style={styles.deleteBtn}
              onClick={() => handleRemoveHabit(habit.id)}
            >
              <Icon name="close" size={13} color="#c8bfb5" />
            </button>
          </div>
        );
      })}

      {/* ── Week header labels (shown once below habits) ── */}
      {habits.length > 0 && (
        <div style={styles.weekLabels}>
          <div style={{ flex: 1 }} />
          {weekDays.map((day) => (
            <span key={day} style={{
              ...styles.weekLabel,
              fontWeight: day === todayStr ? 600 : 400,
              color:      day === todayStr ? "#c4837a" : "#b0a49a",
            }}>
              {shortDay(day)}
            </span>
          ))}
          <div style={{ width: 22 }} />
        </div>
      )}

      {/* ── Empty state ── */}
      {habits.length === 0 && (
        <div style={styles.empty}>
          <Icon name="checklist" size={32} color="#e0d9d2" style={{ marginBottom: 10 }} />
          <p>No habits yet.</p>
          <p style={styles.emptyHint}>Tap "Add habit" to start tracking.</p>
        </div>
      )}

    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  // Progress card
  progressCard: {
    background: "#ffffff",
    border: "1px solid #f0ebe4",
    borderRadius: 14,
    padding: "16px 20px",
    marginBottom: 20,
  },
  progressHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: 14,
  },
  progressTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 18, color: "#2a2420",
  },
  progressSub: {
    fontSize: 12, color: "#a09488", marginTop: 2,
  },
  progressCircle: {
    position: "relative", width: 52, height: 52,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  progressPct: {
    position: "absolute", fontSize: 11, fontWeight: 500, color: "#c4837a",
  },
  progressBarBg: {
    height: 5, background: "#f0ebe4", borderRadius: 10, overflow: "hidden",
  },
  progressBarFill: {
    height: "100%", background: "#c4837a",
    borderRadius: 10, transition: "width 0.4s ease",
  },

  // Section header
  sectionHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: 12,
  },
  sectionTitle: {
    display: "flex", alignItems: "center", gap: 6,
  },
  sectionLabel: {
    fontSize: 11, letterSpacing: 1.5,
    textTransform: "uppercase", color: "#a09488",
  },
  addBtn: {
    display: "flex", alignItems: "center", gap: 4,
    background: "#2a2420", color: "#faf9f7",
    border: "none", borderRadius: 20, padding: "5px 12px",
    fontFamily: "'DM Sans', sans-serif", fontSize: 12, cursor: "pointer",
  },

  // Add form
  addForm: {
    display: "flex", gap: 8, marginBottom: 12,
  },
  addInput: {
    flex: 1, fontFamily: "'DM Sans', sans-serif", fontSize: 13,
    border: "1px solid #e0d9d2", borderRadius: 8,
    padding: "8px 12px", outline: "none", color: "#2a2420",
  },
  addConfirmBtn: {
    background: "#c4837a", color: "#fff",
    border: "none", borderRadius: 8,
    padding: "8px 16px", fontFamily: "'DM Sans', sans-serif",
    fontSize: 13, cursor: "pointer",
  },

  // Habit row
  habitRow: {
    display: "flex", alignItems: "center", gap: 10,
    border: "1px solid",
    borderRadius: 12, padding: "11px 12px",
    marginBottom: 8, transition: "background 0.15s",
  },
  checkBtn: {
    width: 28, height: 28, borderRadius: "50%",
    border: "2px solid", display: "flex",
    alignItems: "center", justifyContent: "center",
    cursor: "pointer", flexShrink: 0,
    transition: "all 0.15s",
  },
  habitInfo: {
    flex: 1, minWidth: 0,
  },
  habitLabelRow: {
    display: "flex", alignItems: "center", gap: 5,
  },
  habitLabel: {
    fontSize: 13, lineHeight: 1.3,
    transition: "all 0.15s",
  },
  streak: {
    display: "flex", alignItems: "center", gap: 3,
    fontSize: 10, color: "#c4837a", marginTop: 2,
  },

  // Week dots
  weekDots: {
    display: "flex", gap: 4, flexShrink: 0,
  },
  weekDot: {
    width: 10, height: 10, borderRadius: "50%",
    cursor: "pointer", transition: "background 0.15s",
    padding: 0,
  },

  // Delete
  deleteBtn: {
    background: "none", border: "none",
    cursor: "pointer", padding: 2, flexShrink: 0,
    display: "flex", alignItems: "center",
  },

  // Week labels
  weekLabels: {
    display: "flex", alignItems: "center",
    gap: 4, paddingLeft: "calc(28px + 10px + 10px)",
    marginBottom: 8, marginTop: -4,
  },
  weekLabel: {
    width: 10, fontSize: 9, textAlign: "center",
  },

  // Empty
  empty: {
    display: "flex", flexDirection: "column",
    alignItems: "center", padding: "36px 0 24px",
    color: "#b0a49a", fontSize: 13, textAlign: "center",
  },
  emptyHint: {
    fontSize: 12, color: "#c8bfb5", marginTop: 4,
  },
};