"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useSearchParamsUpdater } from "@/hooks/use-search-params-updater";
import { DEFAULT_RESOURCE_PERIOD, isResourcePeriod } from "@/lib/resource-period";
import type { ResourcePeriod } from "@/types/resource";

/** Selected Resources period in ?period=; the default (month) and unknown values leave it out. */
export function useResourcePeriod() {
  const searchParams = useSearchParams();
  const updateSearchParams = useSearchParamsUpdater();

  const value = searchParams.get("period");
  const period = isResourcePeriod(value) ? value : DEFAULT_RESOURCE_PERIOD;

  // Only the period param changes; ?view= and other params stay.
  const setPeriod = useCallback(
    (next: ResourcePeriod) =>
      updateSearchParams({ period: next === DEFAULT_RESOURCE_PERIOD ? undefined : next }),
    [updateSearchParams],
  );

  return { period, setPeriod };
}
