"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortableTaskCard } from "@/features/tasks/components/sortable-task-card";
import { TASK_STATUS_COLUMN_CLASS, TASK_STATUS_LABEL } from "@/lib/task-status";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types/task";

interface KanbanColumnProps {
  status: TaskStatus;
  /** Tasks of this column, already in display order. */
  tasks: Task[];
  /** Width and placement, set by the board layout. */
  className?: string;
  /** While filters are active, cards can't be moved. */
  dragDisabled?: boolean;
  /** Opens the task details panel. */
  onOpenTask: (taskId: string) => void;
  /** Opens AddTaskDialog for this column. */
  onAddTask: (status: TaskStatus) => void;
}

/** One board column: status title with task count, task cards and Add task. Also a drop target. */
export function KanbanColumn({
  status,
  tasks,
  className,
  dragDisabled = false,
  onOpenTask,
  onAddTask,
}: KanbanColumnProps) {
  const colors = TASK_STATUS_COLUMN_CLASS[status];
  const titleId = `kanban-column-${status}`;
  // The whole column accepts drops, so an empty column can receive a card too.
  const { setNodeRef, isOver } = useDroppable({ id: status, disabled: dragDisabled });

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={titleId}
      className={cn(
        "flex flex-col gap-3 rounded-xl p-3 transition-shadow",
        colors.surface,
        isOver && tasks.length === 0 && "ring-2 ring-ring/40",
        className,
      )}
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

      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        {tasks.length === 0 ? (
          <p className="rounded-lg border border-dashed border-foreground/15 py-8 text-center text-sm text-muted-foreground">
            No tasks
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onOpen={onOpenTask}
                disabled={dragDisabled}
              />
            ))}
          </ul>
        )}
      </SortableContext>

      <Button
        variant="ghost"
        className={cn("justify-start", colors.action)}
        onClick={() => onAddTask(status)}
      >
        <Plus data-icon="inline-start" />
        Add task
      </Button>
    </section>
  );
}
