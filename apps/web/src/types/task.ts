import type { UserSummary } from "@/types/user";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  /** Empty string when there is no description. */
  description: string;
  status: TaskStatus;
  priority: Priority;
  labels: string[];
  assignee: UserSummary | null;
  /** ISO date (YYYY-MM-DD); null when the task has no deadline. */
  dueDate: string | null;
  /** null when the task hasn't been estimated. */
  estimatedHours: number | null;
  /** Order within the status column, starting at 0. */
  position: number;
  /** ISO date (YYYY-MM-DD). */
  createdAt: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  author: UserSummary;
  content: string;
  /** ISO timestamp (date and time). */
  createdAt: string;
}

export type TaskDueFilter = "overdue" | "week" | "none";

/** Board filters. Within a group any value matches; groups combine (AND). */
export interface TaskFilters {
  /** Matches title or description. */
  q?: string;
  /** User ids; UNASSIGNED_FILTER matches tasks without an assignee. */
  assignee: string[];
  label: string[];
  due: TaskDueFilter[];
}

/** Task fields the user fills in, the same for creating and editing a task. */
export interface TaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  /** Must be a member of the project; null for an unassigned task. */
  assigneeId: string | null;
  /** ISO date (YYYY-MM-DD) or null. */
  dueDate: string | null;
  estimatedHours: number | null;
  labels: string[];
}

/** New task (POST /projects/:id/tasks); it is added to the end of its status column. */
export interface CreateTaskInput extends TaskInput {
  projectId: string;
}

/**
 * Changed task (PATCH /tasks/:id). All fields are sent; a new status moves the task to the
 * end of that column.
 */
export interface UpdateTaskInput extends TaskInput {
  taskId: string;
}

/** Moving a task on the board (PATCH /tasks/:id/move). */
export interface TaskMove {
  taskId: string;
  status: TaskStatus;
  /** 0-based index in the target column, counted without the moved task. */
  position: number;
}
