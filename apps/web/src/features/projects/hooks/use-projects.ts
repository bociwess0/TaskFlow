"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProjects } from "@/services/projects-service";
import type { ProjectListParams } from "@/types/project";

export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (params: ProjectListParams) => [...projectKeys.lists(), params] as const,
};

export function useProjects(params: ProjectListParams = {}) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => getProjects(params),
    // Keep showing the current cards while a new search/filter loads.
    placeholderData: keepPreviousData,
  });
}
