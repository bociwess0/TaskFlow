"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { teamKeys } from "@/features/team/hooks/use-team-members";
import { inviteMember } from "@/services/team-service";
import type { InviteMemberInput } from "@/types/team";

/** Invites a new member; on success every team members list is refetched. */
export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: InviteMemberInput) => inviteMember(input),
    onSuccess: (member) => {
      toast.success(`Invitation sent to ${member.email}`);
      return queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
    },
    onError: (error) => {
      toast.error("Could not send the invitation.", { description: error.message });
    },
  });
}
