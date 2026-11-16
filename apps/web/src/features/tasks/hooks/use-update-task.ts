"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { taskKeys } from "@/features/tasks/hooks/use-project-tasks";
import { updateTask } from "@/services/tasks-service";
import type { UpdateTaskInput } from "@/types/task";

/** Saves changes to a task; on success the board's task list is refetched. */
export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTaskInput) => updateTask(input),
    onSuccess: () => {
      toast.success("Task updated");
      return queryClient.invalidateQueries({ queryKey: taskKeys.projectList(projectId) });
    },
    onError: (error) => {
      toast.error("Could not save the task.", { description: error.message });
    },
  });
}
