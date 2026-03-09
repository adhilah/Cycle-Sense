import { useState, useEffect, useCallback } from "react";
import { storageGet, storageSet, storageDelete } from "../constants/storage";

/**
 * useStorage — generic persistent key-value storage hook.
 *
 * Reads from window.storage on mount, exposes a setValue that both
 * updates local state and writes through to storage.
 *
 * @template T
 * @param {string} key         - storage key (use STORAGE_KEYS constants)
 * @param {T}      initialValue - value used when key is not found in storage
 * @returns {{
 *   value:    T,
 *   setValue: (newValue: T | ((prev: T) => T)) => void,
 *   remove:   () => Promise<void>,
 *   loading:  boolean,
 *   error:    Error|null,
 * }}
 *
 * Usage:
 *   const { value: periods, setValue: setPeriods, loading } =
 *     useStorage(STORAGE_KEYS.PERIODS, []);
 */
export function useStorage(key, initialValue) {
  const [value,   setValue_]   = useState(initialValue);
  const [loading, setLoading]  = useState(true);
  const [error,   setError]    = useState(null);
  const [ready,   setReady]    = useState(false);

  // ── Load on mount ───────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const stored = await storageGet(key, initialValue);
        if (!cancelled) {
          setValue_(stored);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setReady(true);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [key]); // intentionally omit initialValue to avoid re-loading on every render

  // ── Write through to storage whenever value changes (after initial load) ────
  useEffect(() => {
    if (!ready) return;
    storageSet(key, value);
  }, [key, value, ready]);

  // ── setValue — supports both direct value and updater function ──────────────
  const setValue = useCallback((newValue) => {
    setValue_((prev) =>
      typeof newValue === "function" ? newValue(prev) : newValue
    );
  }, []);

  // ── Remove key from storage and reset to initialValue ──────────────────────
  const remove = useCallback(async () => {
    await storageDelete(key);
    setValue_(initialValue);
  }, [key, initialValue]);

  return { value, setValue, remove, loading, error };
}