"use client";

import { useQuery } from "@tanstack/react-query";
import { projectKeys } from "@/features/projects/hooks/use-projects";
import { getProject } from "@/services/projects-service";

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProject(id),
  });
}
