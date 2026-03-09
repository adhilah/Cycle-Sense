/**
 * cycleUtils.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure cycle math and analysis utilities.
 * No React, no side effects — fully unit-testable.
 *
 * All functions take plain data arrays and return plain values.
 */

import { daysBetween, today } from "./dateUtils";
import { getPhaseForDay } from "../constants/phases";

// ── Gap & average calculations ────────────────────────────────────────────────

/**
 * Returns an array of cycle gaps (days between consecutive period start dates).
 * Periods are sorted ascending before calculating.
 *
 * @param {object[]} periods  - array of period entries { start, ... }
 * @returns {number[]}        - gaps in days, length = periods.length - 1
 */
export function getCycleGaps(periods) {
  if (!periods || periods.length < 2) return [];

  const sorted = [...periods].sort((a, b) => a.start.localeCompare(b.start));

  const gaps = [];
  for (let i = 1; i < sorted.length; i++) {
    gaps.push(daysBetween(sorted[i - 1].start, sorted[i].start));
  }
  return gaps;
}

/**
 * Calculates the average cycle length from a list of gap values.
 * Returns null if no gaps exist.
 *
 * @param {number[]} gaps
 * @returns {number|null} - rounded to nearest whole day
 */
export function getAvgCycle(gaps) {
  if (!gaps || gaps.length === 0) return null;
  return Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
}

/**
 * Returns the shortest cycle gap observed.
 * @param {number[]} gaps
 * @returns {number|null}
 */
export function getMinCycle(gaps) {
  return gaps && gaps.length > 0 ? Math.min(...gaps) : null;
}

/**
 * Returns the longest cycle gap observed.
 * @param {number[]} gaps
 * @returns {number|null}
 */
export function getMaxCycle(gaps) {
  return gaps && gaps.length > 0 ? Math.max(...gaps) : null;
}

/**
 * Returns the variability (max gap − min gap).
 * High variability (>14 days) may indicate an irregular cycle.
 *
 * @param {number[]} gaps
 * @returns {number|null}
 */
export function getCycleVariability(gaps) {
  const min = getMinCycle(gaps);
  const max = getMaxCycle(gaps);
  return min !== null ? max - min : null;
}

/**
 * Returns true if the cycle is considered irregular (variability > 14 days).
 * @param {number[]} gaps
 * @returns {boolean}
 */
export function isIrregular(gaps) {
  const v = getCycleVariability(gaps);
  return v !== null && v > 14;
}


// ── Period duration ────────────────────────────────────────────────────────────

/**
 * Returns the average period duration in days (only entries with end dates).
 *
 * @param {object[]} periods  - array of period entries { start, end, ... }
 * @returns {number|null}     - rounded to 1 decimal place
 */
export function getAvgDuration(periods) {
  const completed = (periods || []).filter((p) => p.end);
  if (completed.length === 0) return null;

  const durations = completed.map((p) => daysBetween(p.start, p.end) + 1);
  return parseFloat(
    (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1)
  );
}


// ── Next period prediction ─────────────────────────────────────────────────────

/**
 * Estimates the number of days until the next period.
 * Positive  → next period is in the future.
 * Zero      → next period is today.
 * Negative  → period may be late (overdue by that many days).
 *
 * Returns null if there is not enough data.
 *
 * @param {object|null} lastPeriod  - most recent period entry { start }
 * @param {number|null} avgCycle    - average cycle gap in days
 * @returns {number|null}
 */
export function getNextEstimate(lastPeriod, avgCycle) {
  if (!lastPeriod || !avgCycle) return null;
  const daysSinceLast = daysBetween(lastPeriod.start, today());
  return avgCycle - daysSinceLast;
}

/**
 * Returns the ISO date string of the estimated next period start.
 * Returns null if not enough data.
 *
 * @param {object|null} lastPeriod
 * @param {number|null} avgCycle
 * @returns {string|null}  "YYYY-MM-DD"
 */
export function getNextEstimateDate(lastPeriod, avgCycle) {
  if (!lastPeriod || !avgCycle) return null;
  const nextMs =
    new Date(lastPeriod.start + "T00:00:00").getTime() + avgCycle * 86_400_000;
  return new Date(nextMs).toISOString().split("T")[0];
}


// ── Phase detection ────────────────────────────────────────────────────────────

/**
 * Returns the current cycle phase object based on the last period start date.
 * Falls back to the Luteal phase when cycle day exceeds 28.
 *
 * @param {object|null} lastPeriod  - most recent period { start }
 * @returns {{ name, days, color, dot, icon, tips, summary } | null}
 */
export function getCurrentPhase(lastPeriod) {
  if (!lastPeriod) return null;
  const cycleDay = daysBetween(lastPeriod.start, today()) + 1;
  return getPhaseForDay(cycleDay);
}

/**
 * Returns the current cycle day number (1-indexed from last period start).
 * Returns null if no last period.
 *
 * @param {object|null} lastPeriod
 * @returns {number|null}
 */
export function getCurrentCycleDay(lastPeriod) {
  if (!lastPeriod) return null;
  return daysBetween(lastPeriod.start, today()) + 1;
}


// ── Symptom analysis ──────────────────────────────────────────────────────────

/**
 * Builds a frequency map of symptoms across all period entries.
 * Returns an array sorted by frequency descending.
 *
 * @param {object[]} periods - array of period entries { symptoms: string[] }
 * @param {number}   topN    - limit results to top N (default: all)
 * @returns {{ key: string, count: number, pct: number }[]}
 */
export function getTopSymptoms(periods, topN = Infinity) {
  const freq = {};
  (periods || []).forEach((p) => {
    (p.symptoms || []).forEach((s) => {
      freq[s] = (freq[s] || 0) + 1;
    });
  });

  const total = periods?.length || 1;

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([key, count]) => ({
      key,
      count,
      pct: Math.round((count / total) * 100),
    }));
}


// ── Chart data helpers ────────────────────────────────────────────────────────

/**
 * Converts an array of gap values into SVG polyline-ready {x, y} points.
 * The chart origin is (0, 0) top-left.
 *
 * @param {number[]} gaps       - cycle gap values to plot
 * @param {number}   width      - SVG drawing width in px
 * @param {number}   height     - SVG drawing height in px
 * @param {number}   [padding]  - extra padding added to min/max for visual breathing room
 * @returns {{ x: number, y: number, v: number }[]}
 */
export function buildChartPoints(gaps, width, height, padding = 4) {
  if (!gaps || gaps.length === 0) return [];

  const min = Math.max(0, Math.min(...gaps) - padding);
  const max = Math.max(...gaps) + padding;
  const range = max - min || 1;

  return gaps.map((v, i) => ({
    x: gaps.length > 1 ? (i / (gaps.length - 1)) * width : width / 2,
    y: height - ((v - min) / range) * height,
    v,
  }));
}

/**
 * Converts an array of {x, y} points to an SVG path `d` attribute string.
 *
 * @param {{ x: number, y: number }[]} points
 * @returns {string}  e.g. "M 0 40 L 52 30 L 104 55"
 */
export function buildPathD(points) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

/**
 * Builds the `d` attribute for a closed area fill beneath the chart line.
 * Closes the path along the bottom of the SVG at the given height.
 *
 * @param {string} lineD    - open line path from buildPathD()
 * @param {{ x: number, y: number }[]} points
 * @param {number} height   - SVG drawing height
 * @returns {string}
 */
export function buildAreaD(lineD, points, height) {
  if (points.length === 0) return "";
  const last  = points[points.length - 1];
  const first = points[0];
  return `${lineD} L ${last.x} ${height} L ${first.x} ${height} Z`;
}