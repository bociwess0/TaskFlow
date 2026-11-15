"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PROJECT_SORT_LABEL,
  useProjectFilters,
} from "@/features/projects/hooks/use-project-filters";
import { PROJECT_STATUS_LABEL, PROJECT_STATUSES } from "@/lib/project-status";
import type { ProjectSort, ProjectStatus } from "@/types/project";

const SEARCH_DEBOUNCE_MS = 300;
const ALL_STATUSES = "ALL";
const CONTROL_CLASS = "h-10 bg-card";
const TRIGGER_CLASS = "bg-card data-[size=default]:h-10 px-3";

export function ProjectsToolbar() {
  const { params, setParams } = useProjectFilters();
  const urlQuery = params.q ?? "";

  const [search, setSearch] = useState(urlQuery);
  // Last value this input wrote to the URL, to tell our own updates apart from outside ones.
  const [sentQuery, setSentQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);

  // Sync the input when the URL changes from outside (Clear filters, back/forward).
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    if (urlQuery !== sentQuery.trim()) {
      setSearch(urlQuery);
      setSentQuery(urlQuery);
    }
  }

  useEffect(() => {
    if (search === sentQuery) return;
    const timeout = setTimeout(() => {
      setSentQuery(search);
      setParams({ q: search.trim() || undefined });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [search, sentQuery, setParams]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search projects..."
          aria-label="Search projects"
          className={`${CONTROL_CLASS} pl-9`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:flex">
        <Select
          value={params.status ?? ALL_STATUSES}
          onValueChange={(value) =>
            setParams({
              status: value === ALL_STATUSES ? undefined : (value as ProjectStatus),
            })
          }
        >
          <SelectTrigger aria-label="Filter by status" className={`${TRIGGER_CLASS} w-full sm:w-40`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" align="end">
            <SelectItem value={ALL_STATUSES}>All Statuses</SelectItem>
            {PROJECT_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {PROJECT_STATUS_LABEL[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={params.sort}
          onValueChange={(value) => setParams({ sort: value as ProjectSort })}
        >
          <SelectTrigger aria-label="Sort projects" className={`${TRIGGER_CLASS} w-full sm:w-48`}>
            <span className="text-muted-foreground">Sort by:</span>
            <SelectValue className="mr-auto" />
          </SelectTrigger>
          <SelectContent position="popper" align="end">
            {Object.entries(PROJECT_SORT_LABEL).map(([sort, label]) => (
              <SelectItem key={sort} value={sort}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

/** Placeholder while the URL-driven toolbar loads on the client. */
export function ProjectsToolbarSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Skeleton className="h-10 w-full sm:max-w-xs" />
      <div className="grid grid-cols-2 gap-3 sm:flex">
        <Skeleton className="h-10 sm:w-40" />
        <Skeleton className="h-10 sm:w-48" />
      </div>
    </div>
  );
}
