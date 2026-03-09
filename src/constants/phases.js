/**
 * phases.js
 * Static data for the four menstrual cycle phases.
 * Used by InsightsTab → PhaseGuide component.
 */

/**
 * @typedef {Object} Phase
 * @property {string}   name      - Display name of the phase
 * @property {string}   days      - Day range label e.g. "Days 1–5"
 * @property {number}   dayStart  - First day of this phase (1-indexed)
 * @property {number}   dayEnd    - Last day of this phase (inclusive)
 * @property {string}   color     - Soft background tint (hex)
 * @property {string}   dot       - Accent color for dot / border (hex)
 * @property {string}   icon      - Material Icons Round ligature name
 * @property {string[]} tips      - Self-care tips for this phase
 * @property {string}   summary   - One-line description of the phase
 */

/** @type {Phase[]} */
export const PHASES = [
  {
    name:     "Menstrual",
    days:     "Days 1–5",
    dayStart: 1,
    dayEnd:   5,
    color:    "#e8d5d5",
    dot:      "#c4837a",
    icon:     "water_drop",
    summary:  "The uterine lining sheds. Energy is lower — rest is important.",
    tips: [
      "Rest and warmth help ease cramps.",
      "Iron-rich foods like spinach support energy levels.",
      "Light walks or gentle yoga can reduce discomfort.",
      "Use a heating pad for cramp relief.",
      "Stay hydrated and limit caffeine.",
    ],
  },
  {
    name:     "Follicular",
    days:     "Days 6–13",
    dayStart: 6,
    dayEnd:   13,
    color:    "#d5e8e0",
    dot:      "#6aab8e",
    icon:     "local_florist",
    summary:  "Estrogen rises. Energy and mood improve — a great time to start new things.",
    tips: [
      "Great time to start new habits or goals.",
      "Energy rises — try strength or cardio training.",
      "Social activities and collaboration feel easier now.",
      "Experiment with new foods or creative projects.",
      "Schedule challenging tasks and important meetings.",
    ],
  },
  {
    name:     "Ovulatory",
    days:     "Days 14–16",
    dayStart: 14,
    dayEnd:   16,
    color:    "#d5dde8",
    dot:      "#7a9ec4",
    icon:     "brightness_high",
    summary:  "Peak estrogen. Confidence, communication and energy are at their highest.",
    tips: [
      "Peak confidence — great for presentations or difficult conversations.",
      "High-intensity workouts work well now.",
      "Fertile window — plan accordingly if relevant.",
      "Lean into social events and networking.",
      "Your voice may sound more appealing to others this week.",
    ],
  },
  {
    name:     "Luteal",
    days:     "Days 17–28",
    dayStart: 17,
    dayEnd:   28,
    color:    "#e8e4d5",
    dot:      "#b5a66e",
    icon:     "nights_stay",
    summary:  "Progesterone rises then drops. PMS symptoms may appear toward the end.",
    tips: [
      "Cravings are normal — eat mindfully and regularly.",
      "Reduce caffeine and alcohol to ease PMS symptoms.",
      "Prioritize sleep and winding-down routines.",
      "Gentle movement like walking or pilates is ideal.",
      "Journal or track mood changes to spot patterns.",
    ],
  },
];

/**
 * Returns the phase object for a given cycle day number.
 * Falls back to Luteal for days beyond 28.
 * @param {number} cycleDay - day of cycle (1-indexed)
 * @returns {Phase}
 */
export function getPhaseForDay(cycleDay) {
  return (
    PHASES.find((p) => cycleDay >= p.dayStart && cycleDay <= p.dayEnd) ||
    PHASES[PHASES.length - 1]
  );
}

/**
 * Returns the phase name for a given cycle day.
 * @param {number} cycleDay
 * @returns {string}
 */
export function getPhaseName(cycleDay) {
  return getPhaseForDay(cycleDay).name;
}