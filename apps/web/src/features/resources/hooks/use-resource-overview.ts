"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getResourceOverview } from "@/services/resources-service";
import type { ResourcePeriod } from "@/types/resource";

/** Period used by the Resources page until the period select is added (roadmap 1.6/6). */
export const DEFAULT_RESOURCE_PERIOD: ResourcePeriod = "month";

export const resourceKeys = {
  all: ["resources"] as const,
  overviews: () => [...resourceKeys.all, "overview"] as const,
  overview: (period: ResourcePeriod) => [...resourceKeys.overviews(), { period }] as const,
};

export function useResourceOverview(period: ResourcePeriod) {
  return useQuery({
    queryKey: resourceKeys.overview(period),
    queryFn: () => getResourceOverview({ period }),
    // Keep showing the current numbers while another period loads.
    placeholderData: keepPreviousData,
  });
}
