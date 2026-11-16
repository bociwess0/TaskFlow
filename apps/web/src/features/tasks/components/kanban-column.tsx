import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/features/tasks/components/task-card";
import { TASK_STATUS_COLUMN_CLASS, TASK_STATUS_LABEL } from "@/lib/task-status";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types/task";

interface KanbanColumnProps {
  status: TaskStatus;
  /** Tasks of this column, already in display order. */
  tasks: Task[];
  /** Width and placement, set by the board layout. */
  className?: string;
}

/** One board column: status title with task count, task cards and Add task. */
export function KanbanColumn({ status, tasks, className }: KanbanColumnProps) {
  const colors = TASK_STATUS_COLUMN_CLASS[status];
  const titleId = `kanban-column-${status}`;

  return (
    <section
      aria-labelledby={titleId}
      className={cn("flex flex-col gap-3 rounded-xl p-3", colors.surface, className)}
    >
      <header className="flex items-center gap-2 px-1">
        <h2 id={titleId} className={cn("text-sm font-semibold", colors.title)}>
          {TASK_STATUS_LABEL[status]}
        </h2>
        <span
          className={cn(
            "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums",
            colors.count,
          )}
        >
          <span className="sr-only">Tasks: </span>
          {tasks.length}
        </span>
      </header>

      {tasks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-foreground/15 py-8 text-center text-sm text-muted-foreground">
          No tasks
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} />
            </li>
          ))}
        </ul>
      )}

      {/* Opens AddTaskDialog once it exists. */}
      <Button variant="ghost" className={cn("justify-start", colors.action)}>
        <Plus data-icon="inline-start" />
        Add task
      </Button>
    </section>
  );
}
