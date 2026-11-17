"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTeamMembers } from "@/services/team-service";
import type { TeamMemberListParams } from "@/types/team";

export const teamKeys = {
  all: ["team"] as const,
  lists: () => [...teamKeys.all, "list"] as const,
  list: (params: TeamMemberListParams) => [...teamKeys.lists(), params] as const,
};

export function useTeamMembers(params: TeamMemberListParams = {}) {
  return useQuery({
    queryKey: teamKeys.list(params),
    queryFn: () => getTeamMembers(params),
    // Keep showing the current rows while a new search/filter loads.
    placeholderData: keepPreviousData,
  });
}
