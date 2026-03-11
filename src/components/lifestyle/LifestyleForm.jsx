import { useState } from "react";
import Icon from "../../common/Icon";

/**
 * LifestyleForm — daily wellness journal form.
 * Tracks mood, energy, water, exercise, sleep, and a free-text note.
 * Intentionally different from period logging — focuses on how you FEEL each day.
 */

const MOODS = [
  { key: "great",   label: "Great",   icon: "sentiment_very_satisfied", color: "#6aab8e" },
  { key: "good",    label: "Good",    icon: "sentiment_satisfied",      color: "#7a9ec4" },
  { key: "okay",    label: "Okay",    icon: "sentiment_neutral",        color: "#b5a66e" },
  { key: "low",     label: "Low",     icon: "sentiment_dissatisfied",   color: "#c4837a" },
  { key: "awful",   label: "Awful",   icon: "sentiment_very_dissatisfied", color: "#b85a52" },
];

const ENERGY = [
  { key: "high",    label: "High",    color: "#6aab8e" },
  { key: "medium",  label: "Medium",  color: "#b5a66e" },
  { key: "low",     label: "Low",     color: "#c4837a" },
  { key: "crashed", label: "Crashed", color: "#b85a52" },
];

const INITIAL = {
  mood:     "good",
  energy:   "medium",
  water:    6,
  sleep:    7,
  exercise: 0,
  note:     "",
};

export default function LifestyleForm({ onSave }) {
  const [form,  setForm]  = useState(INITIAL);
  const [saved, setSaved] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => { setSaved(false); setForm(INITIAL); }, 1800);
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <Icon name="edit_note" size={18} color="#7a9ec4" />
        <p style={styles.headerLabel}>Today's Wellness Check-in</p>
      </div>

      {/* Mood selector */}
      <p style={styles.sectionLabel}>
        <Icon name="mood" size={14} color="#a09488" /> How are you feeling?
      </p>
      <div style={styles.moodRow}>
        {MOODS.map((m) => {
          const active = form.mood === m.key;
          return (
            <button
              key={m.key}
              style={{
                ...styles.moodBtn,
                background: active ? m.color + "22" : "#faf9f7",
                borderColor: active ? m.color : "#e0d9d2",
              }}
              onClick={() => set("mood", m.key)}
            >
              <Icon name={m.icon} size={22} color={active ? m.color : "#c8bfb5"} />
              <span style={{ ...styles.moodLabel, color: active ? m.color : "#a09488" }}>
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Energy level */}
      <p style={styles.sectionLabel}>
        <Icon name="bolt" size={14} color="#a09488" /> Energy level
      </p>
      <div style={styles.energyRow}>
        {ENERGY.map((e) => {
          const active = form.energy === e.key;
          return (
            <button
              key={e.key}
              style={{
                ...styles.energyBtn,
                background:  active ? e.color + "22" : "#faf9f7",
                borderColor: active ? e.color : "#e0d9d2",
                color:       active ? e.color : "#6a5f58",
                fontWeight:  active ? 500 : 400,
              }}
              onClick={() => set("energy", e.key)}
            >
              {e.label}
            </button>
          );
        })}
      </div>

      {/* Sliders row */}
      <div style={styles.slidersGrid}>
        {/* Water */}
        <div style={styles.sliderBlock}>
          <div style={styles.sliderTop}>
            <div style={styles.sliderLabelWrap}>
              <Icon name="water_drop" size={13} color="#7a9ec4" />
              <span style={styles.sliderLabel}>Water</span>
            </div>
            <span style={{ ...styles.sliderVal, color: "#7a9ec4" }}>{form.water} gl</span>
          </div>
          <input type="range" min={0} max={12} step={1} value={form.water}
            onChange={(e) => set("water", +e.target.value)} style={styles.range} />
        </div>

        {/* Sleep */}
        <div style={styles.sliderBlock}>
          <div style={styles.sliderTop}>
            <div style={styles.sliderLabelWrap}>
              <Icon name="bedtime" size={13} color="#6aab8e" />
              <span style={styles.sliderLabel}>Sleep</span>
            </div>
            <span style={{ ...styles.sliderVal, color: "#6aab8e" }}>{form.sleep}h</span>
          </div>
          <input type="range" min={3} max={12} step={1} value={form.sleep}
            onChange={(e) => set("sleep", +e.target.value)} style={styles.range} />
        </div>

        {/* Exercise */}
        <div style={styles.sliderBlock}>
          <div style={styles.sliderTop}>
            <div style={styles.sliderLabelWrap}>
              <Icon name="directions_run" size={13} color="#b5a66e" />
              <span style={styles.sliderLabel}>Move</span>
            </div>
            <span style={{ ...styles.sliderVal, color: "#b5a66e" }}>{form.exercise}m</span>
          </div>
          <input type="range" min={0} max={120} step={5} value={form.exercise}
            onChange={(e) => set("exercise", +e.target.value)} style={styles.range} />
        </div>
      </div>

      {/* Daily note */}
      <p style={styles.sectionLabel}>
        <Icon name="notes" size={14} color="#a09488" /> Daily note (optional)
      </p>
      <textarea
        rows={2}
        value={form.note}
        placeholder="How did today feel? Any observations..."
        onChange={(e) => set("note", e.target.value)}
        style={styles.textarea}
      />

      <button style={styles.saveBtn} onClick={handleSave}>
        {saved
          ? <><Icon name="check" size={16} color="#faf9f7" /> Saved</>
          : "Save Check-in"
        }
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    border: "1px solid #f0ebe4",
    borderRadius: 14,
    padding: "18px 20px",
    marginBottom: 20,
  },
  header: {
    display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
  },
  headerLabel: {
    fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#a09488",
  },
  sectionLabel: {
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 12, fontWeight: 500, color: "#4a3f3a", marginBottom: 8,
  },

  // Mood
  moodRow: {
    display: "flex", gap: 6, marginBottom: 16,
  },
  moodBtn: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
    gap: 4, border: "1.5px solid", borderRadius: 10, padding: "8px 2px",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
  },
  moodLabel: {
    fontSize: 9, letterSpacing: 0.3,
  },

  // Energy
  energyRow: {
    display: "flex", gap: 6, marginBottom: 16,
  },
  energyBtn: {
    flex: 1, border: "1.5px solid", borderRadius: 8,
    padding: "7px 0", fontFamily: "'DM Sans', sans-serif",
    fontSize: 12, cursor: "pointer", transition: "all 0.15s",
  },

  // Sliders
  slidersGrid: {
    display: "flex", flexDirection: "column", gap: 12, marginBottom: 16,
  },
  sliderBlock: {},
  sliderTop: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5,
  },
  sliderLabelWrap: {
    display: "flex", alignItems: "center", gap: 5,
  },
  sliderLabel: {
    fontSize: 12, fontWeight: 500, color: "#2a2420",
  },
  sliderVal: {
    fontSize: 12, fontWeight: 500,
  },
  range: {
    WebkitAppearance: "none", width: "100%", height: 4,
    borderRadius: 2, background: "#e0d9d2", outline: "none", cursor: "pointer",
  },

  // Note
  textarea: {
    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
    border: "1px solid #e0d9d2", borderRadius: 6, padding: "8px 10px",
    background: "#fff", color: "#2a2420", outline: "none",
    resize: "none", width: "100%", marginBottom: 16, lineHeight: 1.5,
  },

  saveBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    width: "100%", background: "#2a2420", color: "#faf9f7",
    border: "none", borderRadius: 8, padding: "10px 24px",
    fontFamily: "'DM Sans', sans-serif", fontSize: 14, cursor: "pointer", letterSpacing: 0.5,
  },
};