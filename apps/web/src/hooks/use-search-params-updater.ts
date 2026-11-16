"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

/** Values to set in the URL; undefined or an empty string removes the param. */
export type SearchParamsPatch = Record<string, string | undefined>;

interface UpdateOptions {
  /**
   * Add a history entry, so the browser Back button undoes the change (e.g. closes a panel).
   * By default the current entry is replaced, which suits filters and search.
   */
  push?: boolean;
}

/**
 * Returns a function that updates search params of the current page without scrolling.
 * Used for state that lives in the URL (filters, the open task).
 */
export function useSearchParamsUpdater() {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (patch: SearchParamsPatch, { push = false }: UpdateOptions = {}) => {
      // Read the live URL so delayed calls (debounced search) don't overwrite newer changes.
      const next = new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(patch)) {
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
      }
      const query = next.toString();
      const href = query ? `${pathname}?${query}` : pathname;
      if (push) {
        router.push(href, { scroll: false });
      } else {
        router.replace(href, { scroll: false });
      }
    },
    [router, pathname],
  );
}
