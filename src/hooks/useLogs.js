import { useCallback } from "react";
import { useStorage } from "./useStorage";
import { STORAGE_KEYS } from "../constants/storage";

/**
 * Sample data shown before the user logs their own lifestyle entries.
 */
const SAMPLE_LOGS = [
  { date: "2026-03-01", stress: 7, sleep: 6, exercise: 30, diet: "good",  weight: 58.2 },
  { date: "2026-02-22", stress: 4, sleep: 8, exercise: 45, diet: "great", weight: 57.9 },
  { date: "2026-02-14", stress: 8, sleep: 5, exercise: 0,  diet: "poor",  weight: 58.5 },
  { date: "2026-02-07", stress: 3, sleep: 7, exercise: 60, diet: "great", weight: 57.7 },
];

/**
 * useLogs — manages daily lifestyle log data and averages.
 *
 * @returns {{
 *   logs:       object[],
 *   loading:    boolean,
 *   addLog:     (entry: object) => void,   // upserts by date (today replaces today)
 *   deleteLog:  (date: string) => void,
 *   clearAll:   () => Promise<void>,
 *   averages: {
 *     stress:   number|null,
 *     sleep:    number|null,
 *     exercise: number|null,
 *     weight:   number|null,
 *     count:    number,
 *     highStressCount: number,
 *     poorSleepCount:  number,
 *     greatDietCount:  number,
 *   }
 * }}
 */
export function useLogs() {
  const {
    value: logs,
    setValue: setLogs,
    remove: removeAll,
    loading,
  } = useStorage(STORAGE_KEYS.LOGS, SAMPLE_LOGS);

  // ── CRUD ────────────────────────────────────────────────────────────────────

  /**
   * Add or update a daily log entry.
   * If an entry for the same date already exists it is replaced (upsert).
   * @param {object} entry - { date, stress, sleep, exercise, diet, weight }
   */
  const addLog = useCallback(
    (entry) => {
      setLogs((prev) => {
        const without = prev.filter((l) => l.date !== entry.date);
        return [entry, ...without].sort((a, b) => b.date.localeCompare(a.date));
      });
    },
    [setLogs]
  );

  /**
   * Delete a log entry by its ISO date string.
   * @param {string} date - "YYYY-MM-DD"
   */
  const deleteLog = useCallback(
    (date) => {
      setLogs((prev) => prev.filter((l) => l.date !== date));
    },
    [setLogs]
  );

  /** Remove all logs from state and storage. */
  const clearAll = useCallback(async () => {
    await removeAll();
  }, [removeAll]);

  // ── Averages & pattern counts ───────────────────────────────────────────────
  const averages = computeAverages(logs);

  return {
    logs,
    loading,
    addLog,
    deleteLog,
    clearAll,
    averages,
  };
}

// ── Pure stat computation ─────────────────────────────────────────────────────

/**
 * Computes lifestyle averages and pattern counts from log array.
 * @param {object[]} logs
 * @returns {object}
 */
function computeAverages(logs) {
  const count = logs.length;

  if (count === 0) {
    return {
      stress:          null,
      sleep:           null,
      exercise:        null,
      weight:          null,
      count:           0,
      highStressCount: 0,
      poorSleepCount:  0,
      greatDietCount:  0,
    };
  }

  const avg = (key) =>
    parseFloat(
      (logs.reduce((sum, l) => sum + (Number(l[key]) || 0), 0) / count).toFixed(1)
    );

  // Diet frequency breakdown
  const dietBreakdown = { poor: 0, okay: 0, good: 0, great: 0 };
  logs.forEach((l) => {
    if (dietBreakdown[l.diet] !== undefined) dietBreakdown[l.diet]++;
  });

  // Weight entries only (some may be missing / zero)
  const weightLogs = logs.filter((l) => l.weight && Number(l.weight) > 0);
  const avgWeight =
    weightLogs.length > 0
      ? parseFloat(
          (
            weightLogs.reduce((s, l) => s + Number(l.weight), 0) /
            weightLogs.length
          ).toFixed(1)
        )
      : null;

  return {
    stress:          avg("stress"),
    sleep:           avg("sleep"),
    exercise:        avg("exercise"),
    weight:          avgWeight,
    count,
    highStressCount: logs.filter((l) => l.stress >= 7).length,
    poorSleepCount:  logs.filter((l) => l.sleep < 6).length,
    greatDietCount:  logs.filter((l) => l.diet === "great").length,
    dietBreakdown,
  };
}