/**
 * exportUtils.js
 * Functions to export period and lifestyle data as CSV or plain-text report.
 */

import { daysBetween, fmtDate, fmtDateLong } from "./dateUtils";

// ── Helpers ───────────────────────────────────────────────────────────────────

function triggerDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function todayStamp() {
  return new Date().toISOString().split("T")[0];
}

// ── CSV export ────────────────────────────────────────────────────────────────

/**
 * Exports period history + lifestyle logs as a .csv file.
 * @param {Array} periods  - period log entries
 * @param {Array} logs     - lifestyle log entries
 */
export function exportCSV(periods, logs) {
  // Period rows
  const periodHeader = "Start,End,Duration (days),Flow,Symptoms,Notes";
  const periodRows   = periods.map((p) => {
    const dur = p.end ? daysBetween(p.start, p.end) + 1 : "";
    return `${p.start},${p.end || ""},${dur},${p.flow},"${p.symptoms.join("; ")}","${p.notes}"`;
  });

  // Lifestyle rows
  const logHeader = "Date,Stress (1-10),Sleep (hrs),Exercise (min),Diet,Weight (kg)";
  const logRows   = logs.map(
    (l) => `${l.date},${l.stress},${l.sleep},${l.exercise},${l.diet},${l.weight}`
  );

  const csv = [
    periodHeader,
    ...periodRows,
    "",
    logHeader,
    ...logRows,
  ].join("\n");

  triggerDownload(csv, `cycle-companion-${todayStamp()}.csv`, "text/csv");
}

// ── Plain-text report export ──────────────────────────────────────────────────

/**
 * Exports a formatted plain-text health report as a .txt file.
 * @param {Array}  periods   - period log entries
 * @param {Array}  logs      - lifestyle log entries
 * @param {number} avgCycle  - average cycle length in days
 */
export function exportTXT(periods, logs, avgCycle) {
  const LINE = "─".repeat(44);
  const now  = fmtDateLong(todayStamp());

  // Cycle stats
  const sorted = [...periods].sort((a, b) => a.start.localeCompare(b.start));
  const gaps   = [];
  for (let i = 1; i < sorted.length; i++) {
    gaps.push(daysBetween(sorted[i - 1].start, sorted[i].start));
  }
  const avgGap     = gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : "—";
  const durations  = periods.filter((p) => p.end).map((p) => daysBetween(p.start, p.end) + 1);
  const avgDur     = durations.length
    ? (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1)
    : "—";

  // Lifestyle averages
  const avgStress  = logs.length
    ? (logs.reduce((a, b) => a + b.stress, 0) / logs.length).toFixed(1)
    : "—";
  const avgSleep   = logs.length
    ? (logs.reduce((a, b) => a + b.sleep, 0) / logs.length).toFixed(1)
    : "—";
  const avgExercise = logs.length
    ? Math.round(logs.reduce((a, b) => a + b.exercise, 0) / logs.length)
    : "—";

  // Period history block
  const periodBlock = periods
    .map(
      (p) =>
        `${fmtDate(p.start)} → ${p.end ? fmtDate(p.end) : "ongoing"}` +
        `  |  Flow: ${p.flow}` +
        `  Duration: ${p.end ? daysBetween(p.start, p.end) + 1 + "d" : "?"}` +
        `  Symptoms: ${p.symptoms.join(", ") || "none"}` +
        (p.notes ? `  |  ${p.notes}` : "")
    )
    .join("\n");

  const report = [
    "CYCLE COMPANION — HEALTH REPORT",
    `Generated: ${now}`,
    LINE,
    "",
    "PERIOD SUMMARY",
    LINE,
    `Total Periods Logged  : ${periods.length}`,
    `Avg Period Duration   : ${avgDur} days`,
    `Avg Cycle Gap         : ${avgGap} days`,
    "",
    "PERIOD HISTORY",
    LINE,
    periodBlock,
    "",
    "LIFESTYLE AVERAGES",
    LINE,
    `Avg Stress    : ${avgStress}/10`,
    `Avg Sleep     : ${avgSleep} hrs/night`,
    `Avg Exercise  : ${avgExercise} min/day`,
    `Total Entries : ${logs.length}`,
    "",
    LINE,
    "Note: For personal reference only.",
    "Please consult a healthcare professional for medical advice.",
    LINE,
  ].join("\n");

  triggerDownload(report, `cycle-companion-report-${todayStamp()}.txt`, "text/plain");
}