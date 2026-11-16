"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useSearchParamsUpdater } from "@/hooks/use-search-params-updater";
import { PROJECT_STATUSES } from "@/lib/project-status";
import type { ProjectListParams, ProjectSort, ProjectStatus } from "@/types/project";

export const DEFAULT_PROJECT_SORT: ProjectSort = "newest";

export const PROJECT_SORT_LABEL: Record<ProjectSort, string> = {
  newest: "Newest",
  name: "Name A–Z",
  deadline: "Deadline",
  progress: "Progress",
};

const PROJECT_SORTS = Object.keys(PROJECT_SORT_LABEL) as ProjectSort[];

function isProjectStatus(value: string | null): value is ProjectStatus {
  return PROJECT_STATUSES.some((status) => status === value);
}

function isProjectSort(value: string | null): value is ProjectSort {
  return PROJECT_SORTS.some((sort) => sort === value);
}

/** Reads ?q=&status=&sort= and ignores unknown values, so a bad link still renders. */
function parseParams(searchParams: URLSearchParams): ProjectListParams & { sort: ProjectSort } {
  const q = searchParams.get("q")?.trim();
  const status = searchParams.get("status");
  const sort = searchParams.get("sort");

  return {
    q: q || undefined,
    status: isProjectStatus(status) ? status : undefined,
    sort: isProjectSort(sort) ? sort : DEFAULT_PROJECT_SORT,
  };
}

/** Project list search, filter and sort, kept in the URL so it survives refresh and can be shared. */
export function useProjectFilters() {
  const searchParams = useSearchParams();
  const updateSearchParams = useSearchParamsUpdater();

  const params = useMemo(() => parseParams(searchParams), [searchParams]);

  const setParams = useCallback(
    (patch: Partial<ProjectListParams>) =>
      updateSearchParams({
        ...patch,
        // The default sort is left out, so a plain /projects link stays clean.
        ...("sort" in patch && {
          sort: patch.sort === DEFAULT_PROJECT_SORT ? undefined : patch.sort,
        }),
      }),
    [updateSearchParams],
  );

  const clearFilters = useCallback(
    () => setParams({ q: undefined, status: undefined }),
    [setParams],
  );

  return {
    params,
    setParams,
    clearFilters,
    hasFilters: Boolean(params.q || params.status),
  };
}
