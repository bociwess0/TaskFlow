"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { teamKeys } from "@/features/team/hooks/use-team-members";
import { updateMember } from "@/services/team-service";
import type { UpdateMemberInput } from "@/types/team";

/** Saves a member's role, job title and capacity; on success the member lists are refetched. */
export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateMemberInput) => updateMember(input),
    onSuccess: () => {
      toast.success("Member updated");
      return queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
    },
    onError: (error) => {
      toast.error("Could not save the member.", { description: error.message });
    },
  });
}
