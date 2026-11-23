"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getResourceOverview } from "@/services/resources-service";
import type { CreateAllocationInput, ResourcePeriod } from "@/types/resource";

export const resourceKeys = {
  all: ["resources"] as const,
  overviews: () => [...resourceKeys.all, "overview"] as const,
  overview: (period: ResourcePeriod) => [...resourceKeys.overviews(), { period }] as const,
  checks: () => [...resourceKeys.all, "check"] as const,
  check: (input: CreateAllocationInput) => [...resourceKeys.checks(), input] as const,
};

export function useResourceOverview(period: ResourcePeriod) {
  return useQuery({
    queryKey: resourceKeys.overview(period),
    queryFn: () => getResourceOverview({ period }),
    // Keep showing the current numbers while another period loads.
    placeholderData: keepPreviousData,
  });
}
