import type { ProjectStatus } from "@/types/project";
import type { StatusTone } from "@/types/status";

export const PROJECT_STATUSES: ProjectStatus[] = [
  "PLANNING",
  "IN_PROGRESS",
  "ON_HOLD",
  "COMPLETED",
  "ARCHIVED",
];

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  PLANNING: "Planning",
  IN_PROGRESS: "In Progress",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

/** Badge tone of each project status. */
export const PROJECT_STATUS_TONE: Record<ProjectStatus, StatusTone> = {
  PLANNING: "warning",
  IN_PROGRESS: "info",
  ON_HOLD: "danger",
  COMPLETED: "success",
  ARCHIVED: "neutral",
};

/** Progress bar fill color of each project status. */
export const PROJECT_STATUS_PROGRESS_CLASS: Record<ProjectStatus, string> = {
  PLANNING: "bg-primary",
  IN_PROGRESS: "bg-primary",
  ON_HOLD: "bg-danger",
  COMPLETED: "bg-success",
  ARCHIVED: "bg-primary",
};
