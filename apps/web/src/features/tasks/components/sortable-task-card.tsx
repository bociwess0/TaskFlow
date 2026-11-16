"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "@/features/tasks/components/task-card";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

interface SortableTaskCardProps {
  task: Task;
}

/** A task card that can be dragged with mouse, touch or keyboard (Space, arrows, Space). */
export function SortableTaskCard({ task }: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  return (
    <li ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform), transition }}>
      {/* The drag handle is the whole card; dnd-kit gives it button semantics and keyboard support. */}
      <div
        {...attributes}
        {...listeners}
        aria-label={task.title}
        className={cn(
          "cursor-grab touch-manipulation rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          // The card itself follows the pointer in DragOverlay; here it marks where it will land.
          isDragging && "border-2 border-dashed border-foreground/20 bg-foreground/5 *:invisible",
        )}
      >
        <TaskCard task={task} />
      </div>
    </li>
  );
}
