import { useCallback } from "react";
import { useStorage } from "./useStorage";
import { STORAGE_KEYS } from "../constants/storage";
import { daysBetween } from "../utils/dateUtils";

/**
 * Sample data shown before the user logs their own periods.
 * Remove or replace with an empty array [] in production.
 */
const SAMPLE_PERIODS = [
  // { id: 1, start: "2026-01-28", end: "2026-02-01", flow: "medium", symptoms: ["cramps", "bloating"],     notes: "Started on time" },
  // { id: 2, start: "2025-12-21", end: "2025-12-26", flow: "heavy",  symptoms: ["cramps", "headache"],     notes: "Heavier than usual" },
  // { id: 3, start: "2025-11-09", end: "2025-11-13", flow: "light",  symptoms: ["fatigue"],                notes: "" },
  // { id: 4, start: "2025-10-02", end: "2025-10-06", flow: "medium", symptoms: ["bloating", "moodswings"], notes: "" },
];

/**
 * usePeriods — manages period log data and exposes cycle statistics.
 *
 * @returns {{
 *   periods:     object[],
 *   loading:     boolean,
 *   addPeriod:   (entry: object) => void,
 *   updatePeriod:(entry: object) => void,
 *   deletePeriod:(id: number|string) => void,
 *   clearAll:    () => Promise<void>,
 *   stats: {
 *     count:       number,
 *     avgCycle:    number|null,
 *     minCycle:    number|null,
 *     maxCycle:    number|null,
 *     variability: number|null,
 *     avgDuration: number|null,
 *     lastPeriod:  object|null,
 *     nextEstimate:number|null,   // days until next period (+ve future, -ve overdue)
 *     gaps:        number[],      // cycle gap between each consecutive period
 *   }
 * }}
 */
export function usePeriods() {
  const {
    value: periods,
    setValue: setPeriods,
    remove: removeAll,
    loading,
  } = useStorage(STORAGE_KEYS.PERIODS, SAMPLE_PERIODS);

  // ── Sort helper ─────────────────────────────────────────────────────────────
  const sorted = (arr) =>
    [...arr].sort((a, b) => b.start.localeCompare(a.start));

  // ── CRUD ────────────────────────────────────────────────────────────────────

  /** Add a new period entry. Ignores duplicate ids. */
  const addPeriod = useCallback((entry) => {
    setPeriods((prev) =>
      sorted([entry, ...prev.filter((p) => p.id !== entry.id)])
    );
  }, [setPeriods]);

  /** Replace an existing period entry by id. */
  const updatePeriod = useCallback((entry) => {
    setPeriods((prev) =>
      sorted(prev.map((p) => (p.id === entry.id ? entry : p)))
    );
  }, [setPeriods]);

  /** Delete a period entry by id. */
  const deletePeriod = useCallback((id) => {
    setPeriods((prev) => prev.filter((p) => p.id !== id));
  }, [setPeriods]);

  /** Remove all periods from state and storage. */
  const clearAll = useCallback(() => {
    removeAll();
  }, [removeAll]);

  // ── Stats ───────────────────────────────────────────────────────────────────
  const stats = computeStats(periods);

  return {
    periods,
    loading,
    addPeriod,
    updatePeriod,
    deletePeriod,
    clearAll,
    stats,
  };
}

// ── Pure stat computation ─────────────────────────────────────────────────────

/**
 * Derives cycle statistics from a list of period entries.
 * @param {object[]} periods
 * @returns {object} stats
 */
function computeStats(periods) {
  if (!periods || periods.length === 0) {
    return {
      count: 0,
      avgCycle: null,
      minCycle: null,
      maxCycle: null,
      variability: null,
      avgDuration: null,
      lastPeriod: null,
      nextEstimate: null,
      gaps: [],
    };
  }

  // Sort ascending by start date for gap calculations
  const asc = [...periods].sort((a, b) => a.start.localeCompare(b.start));

  // Cycle gaps (days between consecutive period start dates)
  const gaps = [];
  for (let i = 1; i < asc.length; i++) {
    gaps.push(daysBetween(asc[i - 1].start, asc[i].start));
  }

  const avgCycle =
    gaps.length > 0
      ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length)
      : null;

  const minCycle = gaps.length > 0 ? Math.min(...gaps) : null;
  const maxCycle = gaps.length > 0 ? Math.max(...gaps) : null;
  const variability = minCycle !== null ? maxCycle - minCycle : null;

  // Period durations (only entries with an end date)
  const durations = periods
    .filter((p) => p.end)
    .map((p) => daysBetween(p.start, p.end) + 1);

  const avgDuration =
    durations.length > 0
      ? parseFloat(
          (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1)
        )
      : null;

  // Most recent period (already sorted desc from storage hook)
  const lastPeriod = periods[0] ?? null;

  // Days until next estimated period
  let nextEstimate = null;
  if (lastPeriod && avgCycle) {
    const today = new Date().toISOString().split("T")[0];
    const daysSinceLast = daysBetween(lastPeriod.start, today);
    nextEstimate = avgCycle - daysSinceLast;
  }

  // Symptom frequency map across all periods
  const symptomFrequency = {};
  periods.forEach((p) => {
    (p.symptoms || []).forEach((s) => {
      symptomFrequency[s] = (symptomFrequency[s] || 0) + 1;
    });
  });

  return {
    count: periods.length,
    avgCycle,
    minCycle,
    maxCycle,
    variability,
    avgDuration,
    lastPeriod,
    nextEstimate,
    gaps,
    symptomFrequency,
  };
}