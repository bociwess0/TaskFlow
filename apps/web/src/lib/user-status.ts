import type { StatusTone } from "@/types/status";
import type { UserStatus } from "@/types/user";

export const USER_STATUSES: UserStatus[] = ["ACTIVE", "INVITED", "DEACTIVATED"];

/**
 * ACTIVE shares its label and tone with the "Active" utilization status
 * (lib/utilization-status.ts), so both groups show the same badge.
 */
export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  ACTIVE: "Active",
  INVITED: "Invited",
  DEACTIVATED: "Deactivated",
};

/** Badge tone of each account status. */
export const USER_STATUS_TONE: Record<UserStatus, StatusTone> = {
  ACTIVE: "success",
  INVITED: "warning",
  DEACTIVATED: "neutral",
};
