import type { StatusTone } from "@/types/status";
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

/** Kanban column colors of each status: title, count badge, column surface and Add task button. */
export const TASK_STATUS_COLUMN_CLASS: Record<
  TaskStatus,
  { title: string; count: string; surface: string; action: string }
> = {
  TODO: {
    title: "text-foreground",
    count: "bg-foreground/10 text-foreground",
    surface: "bg-muted/70",
    action: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
  },
  IN_PROGRESS: {
    title: "text-primary",
    count: "bg-primary/10 text-primary-strong",
    surface: "bg-primary/5",
    action: "text-primary hover:bg-primary/10 hover:text-primary-strong",
  },
  REVIEW: {
    title: "text-warning-strong",
    count: "bg-warning/15 text-warning-strong",
    surface: "bg-warning/5",
    action: "text-warning-strong hover:bg-warning/10 hover:text-warning-strong",
  },
  DONE: {
    title: "text-success-strong",
    count: "bg-success/10 text-success-strong",
    surface: "bg-success/5",
    action: "text-success-strong hover:bg-success/10 hover:text-success-strong",
  },
};

/** Badge tone of each task status. */
export const TASK_STATUS_TONE: Record<TaskStatus, StatusTone> = {
  TODO: "neutral",
  IN_PROGRESS: "info",
  REVIEW: "warning",
  DONE: "success",
};
