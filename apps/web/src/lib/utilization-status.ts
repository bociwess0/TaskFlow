import type { UtilizationStatus } from "@/types/resource";
import type { StatusTone } from "@/types/status";

export const UTILIZATION_STATUSES: UtilizationStatus[] = ["AVAILABLE", "ACTIVE", "OVERALLOCATED"];

/**
 * ACTIVE shares its label and tone with the "Active" account status (lib/user-status.ts),
 * so both show the same badge.
 */
export const UTILIZATION_STATUS_LABEL: Record<UtilizationStatus, string> = {
  AVAILABLE: "Available",
  ACTIVE: "Active",
  OVERALLOCATED: "Overallocated",
};

/** Badge tone of each utilization status. */
export const UTILIZATION_STATUS_TONE: Record<UtilizationStatus, StatusTone> = {
  AVAILABLE: "info",
  ACTIVE: "success",
  OVERALLOCATED: "danger",
};
