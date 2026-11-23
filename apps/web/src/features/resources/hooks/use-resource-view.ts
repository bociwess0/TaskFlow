"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useSearchParamsUpdater } from "@/hooks/use-search-params-updater";

export const RESOURCE_VIEWS = ["team", "project"] as const;

export type ResourceView = (typeof RESOURCE_VIEWS)[number];

const DEFAULT_VIEW: ResourceView = "team";

export function isResourceView(value: string | null): value is ResourceView {
  return RESOURCE_VIEWS.some((view) => view === value);
}

/** Selected Resources tab in ?view=; the default (team) and unknown values leave it out. */
export function useResourceView() {
  const searchParams = useSearchParams();
  const updateSearchParams = useSearchParamsUpdater();

  const value = searchParams.get("view");
  const view = isResourceView(value) ? value : DEFAULT_VIEW;

  const setView = useCallback(
    (next: ResourceView) => updateSearchParams({ view: next === DEFAULT_VIEW ? undefined : next }),
    [updateSearchParams],
  );

  return { view, setView };
}
