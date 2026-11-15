"use client";

import { useQuery } from "@tanstack/react-query";
import { projectKeys } from "@/features/projects/hooks/use-projects";
import { isNotFoundError } from "@/services/api-error";
import { getProject } from "@/services/projects-service";

const MAX_RETRIES = 3;

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProject(id),
    // A missing project won't appear on retry; other errors keep the default retries.
    retry: (failureCount, error) => !isNotFoundError(error) && failureCount < MAX_RETRIES,
  });
}
