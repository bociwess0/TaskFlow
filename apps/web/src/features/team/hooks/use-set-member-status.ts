"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceKeys } from "@/features/resources/hooks/use-resource-overview";
import { teamKeys } from "@/features/team/hooks/use-team-members";
import { setMemberStatus } from "@/services/team-service";
import type { SetMemberStatusInput } from "@/types/team";

/**
 * Deactivates or reactivates an account; on success the member lists and resources are
 * refetched.
 */
export function useSetMemberStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SetMemberStatusInput) => setMemberStatus(input),
    onSuccess: (member) => {
      toast.success(
        member.status === "DEACTIVATED" ? "Account deactivated" : "Account reactivated",
      );
      // Capacity and account status also change the resources overview.
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: teamKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: resourceKeys.all }),
      ]);
    },
    onError: (error) => {
      toast.error("Could not change the account status.", { description: error.message });
    },
  });
}
