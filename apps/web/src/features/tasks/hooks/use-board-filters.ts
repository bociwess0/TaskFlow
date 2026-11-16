"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useSearchParamsUpdater } from "@/hooks/use-search-params-updater";
import { hasActiveTaskFilters, TASK_DUE_FILTERS } from "@/lib/task-filters";
import type { TaskDueFilter, TaskFilters } from "@/types/task";

/** Filter groups with several values, stored comma-separated (?label=design,backend). */
type ListFilterKey = "assignee" | "label" | "due";

function readList(searchParams: URLSearchParams, key: ListFilterKey): string[] {
  return (searchParams.get(key) ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function isDueFilter(value: string): value is TaskDueFilter {
  return TASK_DUE_FILTERS.some((filter) => filter === value);
}

/** Reads ?q=&assignee=&label=&due= and ignores unknown due values. */
function parseFilters(searchParams: URLSearchParams): TaskFilters {
  return {
    q: searchParams.get("q")?.trim() || undefined,
    assignee: readList(searchParams, "assignee"),
    label: readList(searchParams, "label"),
    due: readList(searchParams, "due").filter(isDueFilter),
  };
}

/** Board search and filters, kept in the URL so they survive refresh and can be shared. */
export function useBoardFilters() {
  const searchParams = useSearchParams();
  const updateSearchParams = useSearchParamsUpdater();

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const setSearch = useCallback(
    (q: string | undefined) => updateSearchParams({ q }),
    [updateSearchParams],
  );

  const toggleFilter = useCallback(
    (key: ListFilterKey, value: string) => {
      const current: string[] = filters[key];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      updateSearchParams({ [key]: next.join(",") || undefined });
    },
    [filters, updateSearchParams],
  );

  const clearFilters = useCallback(
    () =>
      updateSearchParams({ q: undefined, assignee: undefined, label: undefined, due: undefined }),
    [updateSearchParams],
  );

  return {
    filters,
    setSearch,
    toggleFilter,
    clearFilters,
    /** Selected values in the Filters menu (search not included). */
    activeFilterCount: filters.assignee.length + filters.label.length + filters.due.length,
    hasFilters: hasActiveTaskFilters(filters),
  };
}
