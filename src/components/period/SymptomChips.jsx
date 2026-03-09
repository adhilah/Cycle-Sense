import Icon from "../../common/Icon";

/**
 * SymptomChips — renders a wrapping row of tappable symptom selector chips.
 *
 * Props:
 *  - selected   {string[]}  array of currently selected symptom keys
 *  - onChange   {fn}        callback(updatedSelected: string[])
 */

const SYMPTOMS = [
  { key: "cramps",      label: "Cramps",      icon: "electric_bolt"    },
  { key: "bloating",    label: "Bloating",    icon: "bubble_chart"     },
  { key: "headache",    label: "Headache",    icon: "psychology"       },
  { key: "fatigue",     label: "Fatigue",     icon: "battery_low"      },
  { key: "moodswings",  label: "Mood swings", icon: "swap_vert"        },
  { key: "backpain",    label: "Back pain",   icon: "accessibility"    },
  { key: "nausea",      label: "Nausea",      icon: "sick"             },
  { key: "spotting",    label: "Spotting",    icon: "water_drop"       },
  { key: "breastpain",  label: "Breast pain", icon: "favorite_border"  },
  { key: "acne",        label: "Acne",        icon: "face_retouching_natural" },
];

export default function SymptomChips({ selected = [], onChange }) {
  const toggle = (key) => {
    const next = selected.includes(key)
      ? selected.filter((k) => k !== key)
      : [...selected, key];
    onChange(next);
  };

  return (
    <div style={styles.wrap}>
      {SYMPTOMS.map((s) => {
        const active = selected.includes(s.key);
        return (
          <button
            key={s.key}
            style={{
              ...styles.chip,
              ...(active ? styles.chipActive : {}),
            }}
            onClick={() => toggle(s.key)}
            aria-pressed={active}
          >
            <Icon
              name={s.icon}
              size={13}
              color={active ? "#8a3f38" : "#a09488"}
            />
            <span style={active ? styles.chipLabelActive : styles.chipLabel}>
              {s.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  wrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    border: "1.5px solid #e0d9d2",
    borderRadius: 20,
    padding: "5px 11px",
    fontSize: 12,
    cursor: "pointer",
    background: "#ffffff",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.15s",
  },
  chipActive: {
    background: "#e8d5d5",
    borderColor: "#c4837a",
  },
  chipLabel: {
    color: "#6a5f58",
  },
  chipLabelActive: {
    color: "#8a3f38",
    fontWeight: 500,
  },
};