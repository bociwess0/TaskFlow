"use client";

import {
  type Announcements,
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useId, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { KanbanColumn } from "@/features/tasks/components/kanban-column";
import { TaskCard } from "@/features/tasks/components/task-card";
import { useMoveTask } from "@/features/tasks/hooks/use-move-task";
import { TASK_STATUS_LABEL, TASK_STATUSES } from "@/lib/task-status";
import type { Task, TaskStatus } from "@/types/task";

/**
 * Horizontal scroller that bleeds into the page padding, so cards aren't cut at the edges
 * and their shadows have room (overflow-x also clips vertically, hence the small py).
 * On phones columns snap into place; from sm up scrolling is free.
 */
const SCROLLER_CLASS =
  "-mx-4 flex snap-x snap-mandatory scroll-px-4 items-start gap-4 overflow-x-auto px-4 py-1 sm:-mx-6 sm:snap-none sm:px-6 lg:-mx-8 lg:px-8";

/**
 * Columns share the width equally and never shrink below 18rem. On narrow phones a column
 * takes at most 85% of the width, so part of the next one stays visible as a scroll hint.
 */
const COLUMN_CLASS = "min-w-[min(18rem,85%)] flex-1 basis-0 snap-start";

const SCREEN_READER_INSTRUCTIONS =
  "Press Enter to open the task details. To move a task, press Space to pick it up, use the arrow keys to move it within a column or to another column, then press Space again to drop it, or Escape to cancel.";

/** Space picks a card up and drops it; Enter is left for opening the task details. */
const KEYBOARD_CODES = { start: ["Space"], cancel: ["Escape"], end: ["Space"] };

/** A click right after a drop belongs to the drag, not to opening the card. */
const CLICK_AFTER_DRAG_MS = 250;

/** Task ids of each column, in display order. */
type Columns = Record<TaskStatus, string[]>;

interface DragState {
  /** Dragged task; null after the drop while the optimistic update is applied. */
  activeId: string | null;
  columns: Columns;
  /** Task list the columns were built from; replaced once the cache changes. */
  base: Task[];
}

function groupByStatus(tasks: Task[]): Columns {
  return Object.fromEntries(
    TASK_STATUSES.map((status) => [
      status,
      tasks.filter((task) => task.status === status).map((task) => task.id),
    ]),
  ) as Columns;
}

function isStatus(id: UniqueIdentifier): id is TaskStatus {
  return TASK_STATUSES.some((status) => status === id);
}

/** Column of a task id, or the column itself when the id is a column (empty column drop). */
function findColumn(columns: Columns, id: UniqueIdentifier): TaskStatus | undefined {
  if (isStatus(id)) {
    return id;
  }
  return TASK_STATUSES.find((status) => columns[status].includes(String(id)));
}

interface KanbanBoardProps {
  projectId: string;
  /** Tasks to show, ordered by status and position. */
  tasks: Task[];
  /**
   * Turns drag & drop off, e.g. while filters hide some tasks: a position counted among
   * the visible cards would be wrong in the full list.
   */
  dragDisabled?: boolean;
  /** Opens the task details panel. */
  onOpenTask: (taskId: string) => void;
}

/**
 * Kanban board: one column per task status. Cards move between and within columns with
 * mouse, touch (after a short press, so scrolling still works) or keyboard.
 * Loading lives in ProjectBoard.
 */
export function KanbanBoard({
  projectId,
  tasks,
  dragDisabled = false,
  onOpenTask,
}: KanbanBoardProps) {
  const moveTask = useMoveTask(projectId);
  const dndContextId = useId();
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      keyboardCodes: KEYBOARD_CODES,
    }),
  );
  const lastDragEndRef = useRef(0);

  function handleOpenTask(taskId: string) {
    if (Date.now() - lastDragEndRef.current > CLICK_AFTER_DRAG_MS) {
      onOpenTask(taskId);
    }
  }
  const [drag, setDrag] = useState<DragState | null>(null);

  // After a drop, keep the dropped order until the optimistic update reaches the cache.
  if (drag && drag.activeId === null && drag.base !== tasks) {
    setDrag(null);
  }

  const columns = drag?.columns ?? groupByStatus(tasks);
  const taskById = new Map(tasks.map((task) => [task.id, task]));
  const activeTask = drag?.activeId ? taskById.get(drag.activeId) : undefined;

  function handleDragStart({ active }: DragStartEvent) {
    setDrag({ activeId: String(active.id), columns: groupByStatus(tasks), base: tasks });
  }

  // Moving into another column updates the columns right away, so it can show the drop spot.
  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) {
      return;
    }
    setDrag((current) => {
      if (!current) {
        return current;
      }
      const from = findColumn(current.columns, active.id);
      const to = findColumn(current.columns, over.id);
      if (!from || !to || from === to) {
        return current;
      }
      const activeId = String(active.id);
      const target = [...current.columns[to]];
      const overIndex = target.indexOf(String(over.id));
      target.splice(overIndex === -1 ? target.length : overIndex, 0, activeId);
      return {
        ...current,
        columns: {
          ...current.columns,
          [from]: current.columns[from].filter((id) => id !== activeId),
          [to]: target,
        },
      };
    });
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    lastDragEndRef.current = Date.now();
    if (!drag || !over) {
      setDrag(null);
      return;
    }

    const activeId = String(active.id);
    const status = findColumn(drag.columns, activeId);
    if (!status || findColumn(drag.columns, over.id) !== status) {
      setDrag(null);
      return;
    }

    const current = drag.columns[status];
    const overIndex = isStatus(over.id) ? current.length - 1 : current.indexOf(String(over.id));
    const ids = arrayMove(current, current.indexOf(activeId), overIndex);
    const position = ids.indexOf(activeId);

    const task = taskById.get(activeId);
    if (!task || (task.status === status && task.position === position)) {
      setDrag(null);
      return;
    }

    setDrag({ activeId: null, columns: { ...drag.columns, [status]: ids }, base: tasks });
    moveTask.mutate({ taskId: activeId, status, position });
  }

  const titleOf = (id: UniqueIdentifier) => taskById.get(String(id))?.title ?? "task";

  /** "In Progress, position 2 of 3" for the column or card the dragged task is over. */
  const placeOf = (overId: UniqueIdentifier) => {
    const status = findColumn(columns, overId);
    if (!status) {
      return "the board";
    }
    const ids = columns[status];
    const index = isStatus(overId) ? ids.length - 1 : ids.indexOf(String(overId));
    return `${TASK_STATUS_LABEL[status]}, position ${index + 1} of ${Math.max(ids.length, 1)}`;
  };

  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up task ${titleOf(active.id)}.`,
    onDragOver: ({ active, over }) =>
      over
        ? `Task ${titleOf(active.id)} is over ${placeOf(over.id)}.`
        : `Task ${titleOf(active.id)} is no longer over a column.`,
    onDragEnd: ({ active, over }) =>
      over
        ? `Task ${titleOf(active.id)} was dropped in ${placeOf(over.id)}.`
        : `Task ${titleOf(active.id)} was dropped outside the board and returned to its place.`,
    onDragCancel: ({ active }) =>
      `Moving was cancelled. Task ${titleOf(active.id)} returned to its place.`,
  };

  return (
    <DndContext
      id={dndContextId}
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        lastDragEndRef.current = Date.now();
        setDrag(null);
      }}
      accessibility={{
        announcements,
        screenReaderInstructions: { draggable: SCREEN_READER_INSTRUCTIONS },
      }}
    >
      <div className={SCROLLER_CLASS}>
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={columns[status].flatMap((id) => taskById.get(id) ?? [])}
            className={COLUMN_CLASS}
            dragDisabled={dragDisabled}
            onOpenTask={handleOpenTask}
          />
        ))}
      </div>

      {/* The card under the pointer while dragging. */}
      <DragOverlay>
        {activeTask && (
          <div className="rotate-2 cursor-grabbing rounded-xl shadow-lg">
            <TaskCard task={activeTask} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export function KanbanBoardSkeleton() {
  return (
    <div className={SCROLLER_CLASS} aria-busy="true" aria-label="Loading tasks">
      {TASK_STATUSES.map((status, index) => (
        <div
          key={status}
          className={`${COLUMN_CLASS} flex flex-col gap-3 rounded-xl bg-muted/70 p-3`}
        >
          <Skeleton className="h-5 w-24" />
          {Array.from({ length: 3 - (index % 2) }, (_, cardIndex) => (
            <Skeleton key={cardIndex} className="h-28 rounded-xl bg-card" />
          ))}
        </div>
      ))}
    </div>
  );
}
