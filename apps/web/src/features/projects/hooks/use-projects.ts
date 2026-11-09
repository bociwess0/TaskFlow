"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/services/projects-service";

export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
};

export function useProjects() {
  return useQuery({ queryKey: projectKeys.lists(), queryFn: getProjects });
}
