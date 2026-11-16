"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { taskKeys } from "@/features/tasks/hooks/use-project-tasks";
import { useCurrentUser } from "@/hooks/use-current-user";
import { addTaskComment } from "@/services/tasks-service";
import type { TaskComment } from "@/types/task";

const OPTIMISTIC_ID_PREFIX = "optimistic-";
let optimisticCommentNumber = 0;

/** Whether the comment is shown optimistically and not saved yet. */
export function isPendingComment(comment: TaskComment): boolean {
  return comment.id.startsWith(OPTIMISTIC_ID_PREFIX);
}

/**
 * Adds a comment with an optimistic update: it shows at the end of the list at once
 * (see isPendingComment), is replaced by the saved comment on success and removed on error.
 * Several comments can be sent quickly; the list is refetched when the last one settles.
 */
export function useAddComment(taskId: string) {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const queryKey = taskKeys.comments(taskId);
  const mutationKey = [...queryKey, "add"];

  const replaceComment = (id: string, next: TaskComment | null) =>
    queryClient.setQueryData<TaskComment[]>(queryKey, (comments) =>
      comments?.flatMap((comment) => (comment.id !== id ? [comment] : next ? [next] : [])),
    );

  return useMutation({
    mutationKey,
    mutationFn: (content: string) => addTaskComment({ taskId, content }),
    onMutate: async (content) => {
      // Without the author (still loading) the comment simply appears once it is saved.
      if (!currentUser) return {};

      // Stop in-flight refetches so they don't overwrite the optimistic comment.
      await queryClient.cancelQueries({ queryKey });
      const optimistic: TaskComment = {
        id: `${OPTIMISTIC_ID_PREFIX}${++optimisticCommentNumber}`,
        taskId,
        author: { id: currentUser.id, name: currentUser.name, avatarUrl: currentUser.avatarUrl },
        content,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<TaskComment[]>(queryKey, (comments) =>
        comments ? [...comments, optimistic] : comments,
      );
      return { optimisticId: optimistic.id };
    },
    onSuccess: (saved, _content, result) => {
      if (result.optimisticId) {
        replaceComment(result.optimisticId, saved);
      } else {
        queryClient.setQueryData<TaskComment[]>(queryKey, (comments) =>
          comments ? [...comments, saved] : comments,
        );
      }
    },
    onError: (error, _content, result) => {
      if (result?.optimisticId) {
        replaceComment(result.optimisticId, null);
      }
      toast.error("Could not add the comment.", { description: error.message });
    },
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey }) === 1) {
        return queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}
