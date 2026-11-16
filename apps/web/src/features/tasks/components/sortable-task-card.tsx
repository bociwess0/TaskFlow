"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { KeyboardEvent } from "react";
import { TaskCard } from "@/features/tasks/components/task-card";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

const CARD_HANDLE_CLASS = "rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

interface SortableTaskCardProps {
  task: Task;
  /** Opens the task details panel (click or Enter). */
  onOpen: (taskId: string) => void;
  /** While filters are active, cards can't be moved, only opened. */
  disabled?: boolean;
}

/**
 * A task card that opens on click or Enter and can be dragged with mouse, touch or
 * keyboard (Space picks it up, arrows move it, Space drops it).
 */
export function SortableTaskCard({ task, onOpen, disabled = false }: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled,
  });

  return (
    <li ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform), transition }}>
      {disabled ? (
        <div
          role="button"
          tabIndex={0}
          aria-label={`Open task ${task.title}`}
          onClick={() => onOpen(task.id)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpen(task.id);
            }
          }}
          className={cn(CARD_HANDLE_CLASS, "cursor-pointer")}
        >
          <TaskCard task={task} />
        </div>
      ) : (
        // The whole card is the drag handle; dnd-kit gives it button semantics.
        <div
          {...attributes}
          {...listeners}
          aria-label={task.title}
          onClick={() => onOpen(task.id)}
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
            listeners?.onKeyDown?.(event);
            if (event.key === "Enter" && !isDragging) {
              event.preventDefault();
              onOpen(task.id);
            }
          }}
          className={cn(
            CARD_HANDLE_CLASS,
            "cursor-grab touch-manipulation",
            // The card itself follows the pointer in DragOverlay; here it marks where it will land.
            isDragging && "border-2 border-dashed border-foreground/20 bg-foreground/5 *:invisible",
          )}
        >
          <TaskCard task={task} />
        </div>
      )}
    </li>
  );
}
