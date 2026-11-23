"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { projectKeys } from "@/features/projects/hooks/use-projects";
import { resourceKeys } from "@/features/resources/hooks/use-resource-overview";
import { teamKeys } from "@/features/team/hooks/use-team-members";
import { createAllocation } from "@/services/resources-service";
import type { CreateAllocationInput } from "@/types/resource";

/**
 * Allocates a member to a project. A new allocation also makes the user a project member, so
 * on success the resources data, projects (members, avatars, assignees) and team members
 * (project counts) are refetched.
 */
export function useCreateAllocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAllocationInput) => createAllocation(input),
    onSuccess: () => {
      toast.success("Member allocated");
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: resourceKeys.all }),
        queryClient.invalidateQueries({ queryKey: projectKeys.all }),
        queryClient.invalidateQueries({ queryKey: teamKeys.all }),
      ]);
    },
    onError: (error) => {
      toast.error("Could not allocate the member.", { description: error.message });
    },
  });
}
