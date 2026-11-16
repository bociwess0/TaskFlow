import { daysUntil } from "@/lib/format";
import type { Task, TaskDueFilter, TaskFilters } from "@/types/task";

/** Assignee filter value for tasks without an assignee. */
export const UNASSIGNED_FILTER = "unassigned";

/** "Due this week" means due today or within the next 7 days. */
const DUE_SOON_DAYS = 7;

export const TASK_DUE_FILTERS: TaskDueFilter[] = ["overdue", "week", "none"];

export const TASK_DUE_FILTER_LABEL: Record<TaskDueFilter, string> = {
  overdue: "Overdue",
  week: "Due this week",
  none: "No due date",
};

function matchesDue(task: Task, filter: TaskDueFilter): boolean {
  if (filter === "none") {
    return task.dueDate === null;
  }
  if (task.dueDate === null) {
    return false;
  }
  const days = daysUntil(task.dueDate);
  // Same rule as the red date on the card: done tasks are never overdue.
  return filter === "overdue"
    ? task.status !== "DONE" && days < 0
    : days >= 0 && days <= DUE_SOON_DAYS;
}

export function hasActiveTaskFilters({ q, assignee, label, due }: TaskFilters): boolean {
  return Boolean(q) || assignee.length > 0 || label.length > 0 || due.length > 0;
}

/** Filters already loaded tasks; the order stays the same. */
export function filterTasks(tasks: Task[], { q, assignee, label, due }: TaskFilters): Task[] {
  const search = q?.trim().toLowerCase();

  return tasks.filter(
    (task) =>
      (!search ||
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search)) &&
      (assignee.length === 0 || assignee.includes(task.assignee?.id ?? UNASSIGNED_FILTER)) &&
      (label.length === 0 || task.labels.some((item) => label.includes(item))) &&
      (due.length === 0 || due.some((filter) => matchesDue(task, filter))),
  );
}
