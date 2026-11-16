"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { taskKeys } from "@/features/tasks/hooks/use-project-tasks";
import { createTask } from "@/services/tasks-service";
import type { CreateTaskInput } from "@/types/task";

/** Creates a task in the project; on success the board's task list is refetched. */
export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<CreateTaskInput, "projectId">) => createTask({ ...input, projectId }),
    onSuccess: () => {
      toast.success("Task created");
      return queryClient.invalidateQueries({ queryKey: taskKeys.projectList(projectId) });
    },
    onError: (error) => {
      toast.error("Could not create the task.", { description: error.message });
    },
  });
}
