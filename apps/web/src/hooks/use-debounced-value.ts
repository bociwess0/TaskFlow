"use client";

import { useEffect, useEffectEvent, useState } from "react";

/**
 * The value as it was `delayMs` after it last changed (debounce). Values are compared by
 * their JSON, so a new object with the same content doesn't restart the timer.
 * `isPending` is true while a newer value is waiting.
 */
export function useDebouncedValue<T>(value: T, delayMs: number) {
  const key = JSON.stringify(value);
  const [debounced, setDebounced] = useState({ key, value });

  // The latest value, without restarting the timer on every render.
  const commit = useEffectEvent(() => setDebounced({ key, value }));

  useEffect(() => {
    if (key === debounced.key) return;
    const timeout = setTimeout(commit, delayMs);
    return () => clearTimeout(timeout);
  }, [key, debounced.key, delayMs]);

  return { value: debounced.value, isPending: key !== debounced.key };
}
