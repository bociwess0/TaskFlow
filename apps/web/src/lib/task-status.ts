import type { TaskStatus } from "@/types/task";

export const TASK_STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  DONE: "Done",
};

/** Theme color of each task status, for charts and indicators. */
export const TASK_STATUS_COLOR: Record<TaskStatus, string> = {
  TODO: "var(--chart-5)",
  IN_PROGRESS: "var(--primary)",
  REVIEW: "var(--warning)",
  DONE: "var(--success)",
};
