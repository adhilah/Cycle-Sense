import { useState, useEffect } from "react";
import Icon from "../../common/Icon";
import SymptomChips from "./SymptomChips";

/**
 * PeriodForm — form for logging or editing a period entry.
 *
 * Props:
 *  - editEntry  {object|null}  period object to pre-fill when editing; null = new entry
 *  - onSave     {fn}           callback(entry: object)
 *  - onCancel   {fn}           called when cancel is tapped during edit mode
 */

const FLOW_OPTS = ["spotting", "light", "medium", "heavy"];

const FLOW_COLOR = {
  spotting: { active: "#f0ebe4", border: "#b0a49a", text: "#7a6a60" },
  light:    { active: "#faeae8", border: "#d4857d", text: "#9a5a54" },
  medium:   { active: "#f5d8d5", border: "#c4837a", text: "#8a3f38" },
  heavy:    { active: "#edc8c4", border: "#b85a52", text: "#7a2a24" },
};

const FLOW_LABEL = {
  spotting: "Spotting",
  light:    "Light",
  medium:   "Medium",
  heavy:    "Heavy",
};

const EMPTY = {
  start:    new Date().toISOString().split("T")[0],
  end:      "",
  flow:     "medium",
  symptoms: [],
  notes:    "",
  ongoing:  false,
};

export default function PeriodForm({ editEntry = null, onSave, onCancel }) {
  const [form,  setForm]  = useState(EMPTY);
  const [saved, setSaved] = useState(false);

  // Pre-fill form when an edit entry is passed
  useEffect(() => {
    if (editEntry) {
      setForm({
        start:    editEntry.start,
        end:      editEntry.end || "",
        flow:     editEntry.flow,
        symptoms: editEntry.symptoms || [],
        notes:    editEntry.notes || "",
        ongoing:  !editEntry.end,
      });
    } else {
      setForm(EMPTY);
    }
  }, [editEntry]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!form.start) return;

    onSave({
      id:       editEntry?.id || Date.now(),
      start:    form.start,
      end:      form.ongoing ? "" : form.end,
      flow:     form.flow,
      symptoms: form.symptoms,
      notes:    form.notes.trim(),
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    if (!editEntry) setForm(EMPTY);
  };

  const isEditing = Boolean(editEntry);

  return (
    <div style={styles.card}>

      {/* Header */}
      <div style={styles.header}>
        <Icon
          name={isEditing ? "edit" : "add_circle"}
          size={18}
          color="#c4837a"
        />
        <p style={styles.headerLabel}>
          {isEditing ? "Edit Period Entry" : "Log a Period"}
        </p>
      </div>

      {/* Date pickers */}
      <div style={styles.dateRow}>
        <div style={styles.dateField}>
          <label style={styles.fieldLabel}>
            <Icon name="event" size={13} color="#a09488" />
            Start date *
          </label>
          <input
            type="date"
            value={form.start}
            onChange={(e) => set("start", e.target.value)}
            style={styles.dateInput}
          />
        </div>
        <div style={styles.dateField}>
          <label style={styles.fieldLabel}>
            <Icon name="event" size={13} color="#a09488" />
            End date
          </label>
          <input
            type="date"
            value={form.end}
            disabled={form.ongoing}
            onChange={(e) => set("end", e.target.value)}
            style={{
              ...styles.dateInput,
              opacity: form.ongoing ? 0.4 : 1,
            }}
          />
        </div>
      </div>

      {/* Ongoing toggle */}
      <label style={styles.checkRow}>
        <input
          type="checkbox"
          checked={form.ongoing}
          onChange={(e) => set("ongoing", e.target.checked)}
          style={styles.checkbox}
        />
        <span style={styles.checkLabel}>Period is still ongoing</span>
      </label>

      {/* Flow intensity */}
      <p style={styles.sectionLabel}>
        <Icon name="water_drop" size={14} color="#c4837a" />
        Flow intensity
      </p>
      <div style={styles.flowRow}>
        {FLOW_OPTS.map((fl) => {
          const active  = form.flow === fl;
          const palette = FLOW_COLOR[fl];
          return (
            <button
              key={fl}
              style={{
                ...styles.flowBtn,
                background:   active ? palette.active  : "#faf9f7",
                borderColor:  active ? palette.border  : "#e0d9d2",
                color:        active ? palette.text     : "#6a5f58",
                fontWeight:   active ? 500 : 400,
              }}
              onClick={() => set("flow", fl)}
            >
              {FLOW_LABEL[fl]}
            </button>
          );
        })}
      </div>

      {/* Symptoms */}
      <p style={styles.sectionLabel}>
        <Icon name="medical_information" size={14} color="#a09488" />
        Symptoms
      </p>
      <div style={styles.symptomsWrap}>
        <SymptomChips
          selected={form.symptoms}
          onChange={(next) => set("symptoms", next)}
        />
      </div>

      {/* Notes */}
      <p style={styles.sectionLabel}>
        <Icon name="notes" size={14} color="#a09488" />
        Notes
      </p>
      <textarea
        rows={2}
        value={form.notes}
        placeholder="e.g. Heavier than usual, started early..."
        onChange={(e) => set("notes", e.target.value)}
        style={styles.textarea}
      />

      {/* Actions */}
      <button style={styles.saveBtn} onClick={handleSave}>
        {saved ? (
          <><Icon name="check" size={16} color="#faf9f7" /> Saved</>
        ) : isEditing ? (
          "Update Entry"
        ) : (
          "Save Period"
        )}
      </button>

      {isEditing && (
        <button style={styles.cancelBtn} onClick={onCancel}>
          Cancel edit
        </button>
      )}
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

  // Header
  header: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  headerLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#a09488",
  },

  // Dates
  dateRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 12,
  },
  dateField: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  fieldLabel: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    fontWeight: 500,
    color: "#4a3f3a",
  },
  dateInput: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    border: "1px solid #e0d9d2",
    borderRadius: 6,
    padding: "7px 10px",
    background: "#fff",
    color: "#2a2420",
    outline: "none",
    width: "100%",
  },

  // Ongoing
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    cursor: "pointer",
  },
  checkbox: {
    accentColor: "#c4837a",
    width: 15,
    height: 15,
  },
  checkLabel: {
    fontSize: 13,
    color: "#6a5f58",
  },

  // Section labels
  sectionLabel: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 12,
    fontWeight: 500,
    color: "#4a3f3a",
    marginBottom: 8,
  },

  // Flow buttons
  flowRow: {
    display: "flex",
    gap: 6,
    marginBottom: 16,
  },
  flowBtn: {
    flex: 1,
    border: "2px solid",
    borderRadius: 8,
    padding: "7px 0",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.15s",
  },

  // Symptoms
  symptomsWrap: {
    marginBottom: 16,
  },

  // Notes
  textarea: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    border: "1px solid #e0d9d2",
    borderRadius: 6,
    padding: "8px 10px",
    background: "#fff",
    color: "#2a2420",
    outline: "none",
    resize: "none",
    width: "100%",
    marginBottom: 16,
    lineHeight: 1.5,
  },

  // Buttons
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
  cancelBtn: {
    display: "block",
    margin: "10px auto 0",
    background: "none",
    border: "none",
    color: "#c4837a",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    cursor: "pointer",
    textDecoration: "underline",
  },
};