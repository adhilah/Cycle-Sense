/**
 * dateUtils.js
 * Pure date helper functions — no React, fully testable.
 */

/**
 * Returns the number of whole days between two ISO date strings.
 * @param {string} a - earlier date "YYYY-MM-DD"
 * @param {string} b - later date  "YYYY-MM-DD"
 * @returns {number}
 */
export function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86_400_000);
}

/**
 * Formats an ISO date string to a human-readable short date.
 * e.g. "2026-03-09" → "9 Mar 2026"
 * @param {string} d - ISO date string "YYYY-MM-DD"
 * @returns {string}
 */
export function fmtDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Formats an ISO date string to a long human-readable date.
 * e.g. "2026-03-09" → "9 March 2026"
 * @param {string} d - ISO date string "YYYY-MM-DD"
 * @returns {string}
 */
export function fmtDateLong(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Returns today's date as an ISO string "YYYY-MM-DD".
 * @returns {string}
 */
export function today() {
  return new Date().toISOString().split("T")[0];
}

/**
 * Adds `days` to an ISO date string and returns a new ISO date string.
 * @param {string} dateStr - base date "YYYY-MM-DD"
 * @param {number} days    - number of days to add (can be negative)
 * @returns {string}
 */
export function addDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}