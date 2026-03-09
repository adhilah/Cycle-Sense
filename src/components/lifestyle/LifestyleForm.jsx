import { useState } from "react";
import Icon from "../../common/Icon";

/**
 * LifestyleForm — form for logging daily lifestyle data.
 *
 * Props:
 *  - onSave   {fn}  callback({ stress, sleep, exercise, diet, weight })
 */

const SLIDERS = [
  {
    key:     "stress",
    label:   "Stress Level",
    icon:    "sentiment_dissatisfied",
    color:   "#c4837a",
    min:     1,
    max:     10,
    step:    1,
    display: (v) => `${v}/10`,
  },
  {
    key:     "sleep",
    label:   "Sleep",
    icon:    "bedtime",
    color:   "#6aab8e",
    min:     3,
    max:     12,
    step:    1,
    display: (v) => `${v}h`,
  },
  {
    key:     "exercise",
    label:   "Exercise",
    icon:    "directions_run",
    color:   "#7a9ec4",
    min:     0,
    max:     120,
    step:    5,
    display: (v) => `${v}m`,
  },
];

const INITIAL = { stress: 5, sleep: 7, exercise: 30, diet: "good", weight: "" };

export default function LifestyleForm({ onSave }) {
  const [form,  setForm]  = useState(INITIAL);
  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={styles.card}>
      {/* Section header */}
      <div style={styles.header}>
        <Icon name="edit_note" size={18} color="#7a9ec4" />
        <p style={styles.headerLabel}>Log Today</p>
      </div>

      {/* Sliders */}
      {SLIDERS.map((s) => (
        <div key={s.key} style={styles.sliderRow}>
          <div style={styles.sliderTop}>
            <div style={styles.sliderLabelWrap}>
              <Icon name={s.icon} size={15} color={s.color} />
              <span style={styles.sliderLabel}>{s.label}</span>
            </div>
            <span style={{ ...styles.sliderValue, color: s.color }}>
              {s.display(form[s.key])}
            </span>
          </div>
          <input
            type="range"
            min={s.min}
            max={s.max}
            step={s.step}
            value={form[s.key]}
            onChange={(e) => handleChange(s.key, +e.target.value)}
            style={styles.range}
          />
        </div>
      ))}

      {/* Diet + Weight row */}
      <div style={styles.bottomRow}>
        {/* Diet */}
        <div style={styles.selectWrap}>
          <div style={styles.sliderLabelWrap}>
            <Icon name="restaurant" size={14} color="#b5a66e" />
            <span style={styles.sliderLabel}>Diet Quality</span>
          </div>
          <select
            value={form.diet}
            onChange={(e) => handleChange("diet", e.target.value)}
            style={styles.select}
          >
            <option value="poor">Poor</option>
            <option value="okay">Okay</option>
            <option value="good">Good</option>
            <option value="great">Great</option>
          </select>
        </div>

        {/* Weight */}
        <div style={styles.weightWrap}>
          <div style={styles.sliderLabelWrap}>
            <Icon name="monitor_weight" size={14} color="#b5a66e" />
            <span style={styles.sliderLabel}>Weight (kg)</span>
          </div>
          <input
            type="number"
            value={form.weight}
            placeholder="58.0"
            step="0.1"
            onChange={(e) => handleChange("weight", e.target.value)}
            style={styles.numberInput}
          />
        </div>
      </div>

      {/* Save button */}
      <button style={styles.saveBtn} onClick={handleSave}>
        {saved ? (
          <><Icon name="check" size={16} color="#faf9f7" /> Saved</>
        ) : (
          "Save Today's Log"
        )}
      </button>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  card: {
    background: "#ffffff",
    border: "1px solid #f0ebe4",
    borderRadius: 14,
    padding: "18px 20px",
    marginBottom: 20,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },
  headerLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#a09488",
  },

  // Slider
  sliderRow: {
    marginBottom: 16,
  },
  sliderTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  sliderLabelWrap: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  sliderLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: "#2a2420",
  },
  sliderValue: {
    fontSize: 13,
    fontWeight: 500,
  },
  range: {
    WebkitAppearance: "none",
    width: "100%",
    height: 4,
    borderRadius: 2,
    background: "#e0d9d2",
    outline: "none",
    cursor: "pointer",
  },

  // Diet + Weight
  bottomRow: {
    display: "flex",
    gap: 12,
    alignItems: "flex-end",
    marginBottom: 18,
  },
  selectWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  select: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    border: "1px solid #e0d9d2",
    borderRadius: 6,
    padding: "7px 10px",
    background: "#fff",
    color: "#2a2420",
    outline: "none",
  },
  weightWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  numberInput: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    border: "1px solid #e0d9d2",
    borderRadius: 6,
    padding: "7px 10px",
    width: 84,
    outline: "none",
    color: "#2a2420",
  },

  // Save
  saveBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    width: "100%",
    background: "#2a2420",
    color: "#faf9f7",
    border: "none",
    borderRadius: 8,
    padding: "10px 24px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    cursor: "pointer",
    letterSpacing: 0.5,
  },
};