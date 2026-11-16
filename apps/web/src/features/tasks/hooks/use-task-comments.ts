"use client";

import { useQuery } from "@tanstack/react-query";
import { taskKeys } from "@/features/tasks/hooks/use-project-tasks";
import { getTaskComments } from "@/services/tasks-service";

export function useTaskComments(taskId: string) {
  return useQuery({
    queryKey: taskKeys.comments(taskId),
    queryFn: () => getTaskComments(taskId),
  });
}
