import type { Priority } from "@/types/task";

export const TASK_PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export const TASK_PRIORITY_LABEL: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

/** Background color of each priority, for bars and dots. */
export const TASK_PRIORITY_BG_CLASS: Record<Priority, string> = {
  URGENT: "bg-danger",
  HIGH: "bg-warning",
  MEDIUM: "bg-primary",
  LOW: "bg-muted-foreground/40",
};

/** Text (icon) color of each priority, matching TASK_PRIORITY_BG_CLASS. */
export const TASK_PRIORITY_TEXT_CLASS: Record<Priority, string> = {
  URGENT: "text-danger",
  HIGH: "text-warning",
  MEDIUM: "text-primary",
  LOW: "text-muted-foreground",
};
