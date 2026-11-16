import { TASK_STATUSES } from "@/lib/task-status";
import type { Task, TaskMove } from "@/types/task";

/** Board order: by status column, then by position within the column. */
export function compareTasks(a: Task, b: Task): number {
  return (
    TASK_STATUSES.indexOf(a.status) - TASK_STATUSES.indexOf(b.status) || a.position - b.position
  );
}

/**
 * Moves a task to `status` at `position` (0-based, counted without the moved task) and
 * renumbers the old and the new column. Returns a new, board-ordered list; changed tasks are
 * new objects, so the input (e.g. the query cache) is never mutated.
 *
 * The mock service and the optimistic update both use it, so they always agree.
 */
export function applyTaskMove(tasks: Task[], { taskId, status, position }: TaskMove): Task[] {
  const moved = tasks.find((task) => task.id === taskId);
  if (!moved) {
    return tasks;
  }

  const byPosition = (a: Task, b: Task) => a.position - b.position;
  const others = tasks.filter((task) => task.id !== taskId);

  const target = others.filter((task) => task.status === status).sort(byPosition);
  const index = Math.min(Math.max(position, 0), target.length);
  target.splice(index, 0, { ...moved, status });

  const renumbered = new Map<string, Task>();
  target.forEach((task, i) => renumbered.set(task.id, { ...task, position: i }));
  if (moved.status !== status) {
    others
      .filter((task) => task.status === moved.status)
      .sort(byPosition)
      .forEach((task, i) => renumbered.set(task.id, { ...task, position: i }));
  }

  return tasks.map((task) => renumbered.get(task.id) ?? task).sort(compareTasks);
}
