import type { MilestoneStatus } from "@/types/project";
import type { StatusTone } from "@/types/status";

export const MILESTONE_STATUSES: MilestoneStatus[] = ["PENDING", "IN_PROGRESS", "COMPLETED"];

export const MILESTONE_STATUS_LABEL: Record<MilestoneStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

/** Badge tone of each milestone status. */
export const MILESTONE_STATUS_TONE: Record<MilestoneStatus, StatusTone> = {
  PENDING: "warning",
  IN_PROGRESS: "info",
  COMPLETED: "success",
};
