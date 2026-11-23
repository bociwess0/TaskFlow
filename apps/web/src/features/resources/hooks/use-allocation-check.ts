"use client";

import { keepPreviousData, skipToken, useQuery } from "@tanstack/react-query";
import { resourceKeys } from "@/features/resources/hooks/use-resource-overview";
import { checkAllocation } from "@/services/resources-service";
import type { CreateAllocationInput } from "@/types/resource";

/**
 * Overallocation check for a new allocation. Pass null while the form is incomplete or
 * invalid (see parseAllocationInput); no request is sent then.
 */
export function useAllocationCheck(input: CreateAllocationInput | null) {
  return useQuery({
    queryKey: input ? resourceKeys.check(input) : resourceKeys.checks(),
    queryFn: input ? () => checkAllocation(input) : skipToken,
    // Keep showing the previous result while the check for new values loads.
    placeholderData: keepPreviousData,
  });
}
