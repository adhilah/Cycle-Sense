/**
 * storage.js
 * Central registry of all persistent storage keys used in the app.
 *
 * Import these constants instead of hardcoding key strings anywhere,
 * so a key rename only needs to happen in one place.
 *
 * Usage:
 *   import { STORAGE_KEYS } from "../constants/storage";
 *   await window.storage.get(STORAGE_KEYS.PERIODS);
 */

export const STORAGE_KEYS = {
  /** Array of period log entries { id, start, end, flow, symptoms, notes } */
  PERIODS: "cc-period-logs",

  /** Array of daily lifestyle log entries { date, stress, sleep, exercise, diet, weight } */
  LOGS: "cc-lifestyle-logs",

  /** User preferences object { name, avgCycleOverride, theme } */
  PREFERENCES: "cc-user-preferences",
};

/**
 * Helper — safely read a JSON value from storage.
 * Returns the parsed value, or `fallback` if the key is missing or parse fails.
 *
 * @template T
 * @param {string}  key       - storage key
 * @param {T}       fallback  - value returned when the key is not found
 * @returns {Promise<T>}
 */
export async function storageGet(key, fallback = null) {
  try {
    const result = await window.storage.get(key);
    return result ? JSON.parse(result.value) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Helper — safely write a JSON value to storage.
 * Silently swallows errors (e.g. storage quota exceeded).
 *
 * @param {string} key    - storage key
 * @param {*}      value  - any JSON-serialisable value
 * @returns {Promise<void>}
 */
export async function storageSet(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value));
  } catch {
    // Storage write failed — app continues without persistence
  }
}

/**
 * Helper — safely delete a key from storage.
 *
 * @param {string} key - storage key
 * @returns {Promise<void>}
 */
export async function storageDelete(key) {
  try {
    await window.storage.delete(key);
  } catch {
    // Ignore
  }
}