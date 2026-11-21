"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { teamKeys } from "@/features/team/hooks/use-team-members";
import { setMemberStatus } from "@/services/team-service";
import type { SetMemberStatusInput } from "@/types/team";

/** Deactivates or reactivates an account; on success the member lists are refetched. */
export function useSetMemberStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SetMemberStatusInput) => setMemberStatus(input),
    onSuccess: (member) => {
      toast.success(
        member.status === "DEACTIVATED" ? "Account deactivated" : "Account reactivated",
      );
      return queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
    },
    onError: (error) => {
      toast.error("Could not change the account status.", { description: error.message });
    },
  });
}
