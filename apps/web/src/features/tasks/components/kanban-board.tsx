import { Skeleton } from "@/components/ui/skeleton";
import { KanbanColumn } from "@/features/tasks/components/kanban-column";
import { TASK_STATUSES } from "@/lib/task-status";
import type { Task } from "@/types/task";

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

interface KanbanBoardProps {
  /** All tasks of the project, ordered by status and position. */
  tasks: Task[];
}

/** Kanban board: one column per task status. Display only; loading lives in ProjectBoard. */
export function KanbanBoard({ tasks }: KanbanBoardProps) {
  return (
    <div className={SCROLLER_CLASS}>
      {TASK_STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasks.filter((task) => task.status === status)}
          className={COLUMN_CLASS}
        />
      ))}
    </div>
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
