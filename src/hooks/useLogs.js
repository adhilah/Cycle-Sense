import { useCallback } from "react";
import { useStorage } from "./useStorage";
import { STORAGE_KEYS } from "../constants/storage";

/**
 * useLogs — now used only for InsightsTab lifestyle averages.
 * The Lifestyle tab itself manages habit completions directly via useStorage.
 *
 * Kept for backward compatibility with InsightsTab's logAverages prop.
 */
export function useLogs() {
  const { value: logs, setValue: setLogs, remove: removeAll } = useStorage(STORAGE_KEYS.LOGS, []);

  const addLog = useCallback((entry) => {
    setLogs((prev) => {
      const without = prev.filter((l) => l.date !== entry.date);
      return [entry, ...without].sort((a, b) => b.date.localeCompare(a.date));
    });
  }, [setLogs]);

  const deleteLog = useCallback((date) => {
    setLogs((prev) => prev.filter((l) => l.date !== date));
  }, [setLogs]);

  const clearAll = useCallback(() => removeAll(), [removeAll]);

  const averages = { count: logs.length, sleep: null, water: null, exercise: null };

  return { logs, addLog, deleteLog, clearAll, averages };
}