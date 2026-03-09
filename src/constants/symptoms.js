/**
 * symptoms.js
 * Master list of trackable period symptoms.
 * Used by SymptomChips and PeriodCard components.
 *
 * @typedef {Object} Symptom
 * @property {string} key    - unique identifier (lowercase, no spaces)
 * @property {string} label  - human-readable display label
 * @property {string} icon   - Material Icons Round ligature name
 */

/** @type {Symptom[]} */
export const SYMPTOMS = [
  {
    key:   "cramps",
    label: "Cramps",
    icon:  "electric_bolt",
  },
  {
    key:   "bloating",
    label: "Bloating",
    icon:  "bubble_chart",
  },
  {
    key:   "headache",
    label: "Headache",
    icon:  "psychology",
  },
  {
    key:   "fatigue",
    label: "Fatigue",
    icon:  "battery_low",
  },
  {
    key:   "moodswings",
    label: "Mood swings",
    icon:  "swap_vert",
  },
  {
    key:   "backpain",
    label: "Back pain",
    icon:  "accessibility",
  },
  {
    key:   "nausea",
    label: "Nausea",
    icon:  "sick",
  },
  {
    key:   "spotting",
    label: "Spotting",
    icon:  "water_drop",
  },
  {
    key:   "breastpain",
    label: "Breast pain",
    icon:  "favorite_border",
  },
  {
    key:   "acne",
    label: "Acne",
    icon:  "face_retouching_natural",
  },
  {
    key:   "insomnia",
    label: "Insomnia",
    icon:  "nightlight",
  },
  {
    key:   "hotflashes",
    label: "Hot flashes",
    icon:  "thermostat",
  },
];

/**
 * Returns a symptom object by key.
 * @param {string} key
 * @returns {Symptom|undefined}
 */
export function getSymptom(key) {
  return SYMPTOMS.find((s) => s.key === key);
}

/**
 * Returns the display label for a given symptom key.
 * Falls back to the key itself if not found.
 * @param {string} key
 * @returns {string}
 */
export function getSymptomLabel(key) {
  return getSymptom(key)?.label ?? key;
}

/**
 * Returns the Material icon name for a given symptom key.
 * Falls back to a generic medical icon.
 * @param {string} key
 * @returns {string}
 */
export function getSymptomIcon(key) {
  return getSymptom(key)?.icon ?? "medical_information";
}

/**
 * Converts an array of symptom keys to an array of label strings.
 * Useful for display and export.
 * @param {string[]} keys
 * @returns {string[]}
 */
export function symptomsToLabels(keys = []) {
  return keys.map(getSymptomLabel);
}