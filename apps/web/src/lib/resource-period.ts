import type { ResourcePeriod } from "@/types/resource";

export const RESOURCE_PERIODS: ResourcePeriod[] = ["week", "month", "quarter"];

/** Period the Resources page shows when ?period= is missing. */
export const DEFAULT_RESOURCE_PERIOD: ResourcePeriod = "month";

export const RESOURCE_PERIOD_LABEL: Record<ResourcePeriod, string> = {
  week: "This week",
  month: "This month",
  quarter: "This quarter",
};

export function isResourcePeriod(value: string | null): value is ResourcePeriod {
  return RESOURCE_PERIODS.some((period) => period === value);
}
