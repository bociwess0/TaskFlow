"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useSearchParamsUpdater } from "@/hooks/use-search-params-updater";
import { ROLES } from "@/lib/user-role";
import type { TeamMemberListParams } from "@/types/team";
import type { Role } from "@/types/user";

function isRole(value: string | null): value is Role {
  return ROLES.some((role) => role === value);
}

/** Reads ?q=&role= and ignores an unknown role, so a bad link still renders. */
function parseParams(searchParams: URLSearchParams): TeamMemberListParams {
  const q = searchParams.get("q")?.trim();
  const role = searchParams.get("role");

  return {
    q: q || undefined,
    role: isRole(role) ? role : undefined,
  };
}

/** Team members search and role filter, kept in the URL so it survives refresh and can be shared. */
export function useTeamFilters() {
  const searchParams = useSearchParams();
  const updateSearchParams = useSearchParamsUpdater();

  const params = useMemo(() => parseParams(searchParams), [searchParams]);

  const setParams = useCallback(
    (patch: Partial<TeamMemberListParams>) => updateSearchParams(patch),
    [updateSearchParams],
  );

  const clearFilters = useCallback(() => setParams({ q: undefined, role: undefined }), [setParams]);

  return {
    params,
    setParams,
    clearFilters,
    hasFilters: Boolean(params.q || params.role),
  };
}
