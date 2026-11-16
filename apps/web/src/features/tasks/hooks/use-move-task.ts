"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { taskKeys } from "@/features/tasks/hooks/use-project-tasks";
import { applyTaskMove } from "@/lib/task-move";
import { moveTask } from "@/services/tasks-service";
import type { Task, TaskMove } from "@/types/task";

/**
 * Moves a task on the board with an optimistic update: the cached task list changes at once,
 * is rolled back if the request fails, and is refetched when the last move settles.
 */
export function useMoveTask(projectId: string) {
  const queryClient = useQueryClient();
  const queryKey = taskKeys.projectList(projectId);
  const mutationKey = [...queryKey, "move"];

  return useMutation({
    mutationKey,
    mutationFn: (move: TaskMove) => moveTask(move),
    onMutate: async (move) => {
      // Stop in-flight refetches so they don't overwrite the optimistic list.
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Task[]>(queryKey);
      if (previous) {
        queryClient.setQueryData<Task[]>(queryKey, applyTaskMove(previous, move));
      }
      return { previous };
    },
    onError: (_error, _move, result) => {
      if (result?.previous) {
        queryClient.setQueryData(queryKey, result.previous);
      }
      toast.error("Could not move the task. Your change was undone.");
    },
    onSettled: () => {
      // With several quick moves, refetch only after the last one, so the board doesn't jump.
      if (queryClient.isMutating({ mutationKey }) === 1) {
        return queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}
