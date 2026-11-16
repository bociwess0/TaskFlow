"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

/** Values to set in the URL; undefined or an empty string removes the param. */
export type SearchParamsPatch = Record<string, string | undefined>;

/**
 * Returns a function that updates search params of the current page without adding
 * history entries or scrolling. Used for filters that live in the URL.
 */
export function useSearchParamsUpdater() {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (patch: SearchParamsPatch) => {
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
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname],
  );
}
