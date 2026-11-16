"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjectTasks } from "@/services/tasks-service";

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  projectList: (projectId: string) => [...taskKeys.lists(), { projectId }] as const,
  comments: (taskId: string) => [...taskKeys.all, "comments", taskId] as const,
};

export function useProjectTasks(projectId: string) {
  return useQuery({
    queryKey: taskKeys.projectList(projectId),
    queryFn: () => getProjectTasks(projectId),
  });
}
