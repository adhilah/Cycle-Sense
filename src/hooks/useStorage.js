import { useState, useEffect, useCallback } from "react";
import { storageGet, storageSet, storageDelete } from "../constants/storage";

/**
 * useStorage — generic persistent key-value hook backed by localStorage.
 *
 * Reads synchronously on mount, writes on every value change.
 *
 * @template T
 * @param {string} key           - storage key (use STORAGE_KEYS constants)
 * @param {T}      initialValue  - value used when key is not found in storage
 * @returns {{
 *   value:    T,
 *   setValue: (newValue: T | ((prev: T) => T)) => void,
 *   remove:   () => void,
 *   loading:  boolean,
 * }}
 */
export function useStorage(key, initialValue) {
  // Initialise directly from localStorage — no async needed
  const [value, setValue_] = useState(() => storageGet(key, initialValue));
  const [ready, setReady]  = useState(false);

  // Mark ready after first render so we don't write back on mount
  useEffect(() => {
    setReady(true);
  }, []);

  // Write to localStorage whenever value changes (skip the initial mount)
  useEffect(() => {
    if (!ready) return;
    storageSet(key, value);
  }, [key, value, ready]);

  // setValue — supports direct value or updater function
  const setValue = useCallback((newValue) => {
    setValue_((prev) =>
      typeof newValue === "function" ? newValue(prev) : newValue
    );
  }, []);

  // Remove key from localStorage and reset to initialValue
  const remove = useCallback(() => {
    storageDelete(key);
    setValue_(initialValue);
  }, [key, initialValue]);

  return { value, setValue, remove, loading: false };
}