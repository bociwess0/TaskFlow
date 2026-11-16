"use client";

import { Info } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { useProject } from "@/features/projects/hooks/use-project";
import { AddTaskDialog } from "@/features/tasks/components/add-task-dialog";
import { BoardToolbar } from "@/features/tasks/components/board-toolbar";
import { KanbanBoard, KanbanBoardSkeleton } from "@/features/tasks/components/kanban-board";
import { TaskDetailsSheet } from "@/features/tasks/components/task-details-sheet";
import { useBoardFilters } from "@/features/tasks/hooks/use-board-filters";
import { useOpenTask } from "@/features/tasks/hooks/use-open-task";
import { useProjectTasks } from "@/features/tasks/hooks/use-project-tasks";
import { filterTasks } from "@/lib/task-filters";
import type { TaskStatus } from "@/types/task";

/**
 * Board tab: loads the project's tasks, filters them on the client (the board always loads
 * the whole project) and shows them on the Kanban board.
 */
export function ProjectBoard() {
  const { projectId } = useParams<{ projectId: string }>();
  // ProjectShell has already loaded the project, so its members come from the cache.
  const { data: project } = useProject(projectId);
  const { data: tasks, isPending, isError, refetch } = useProjectTasks(projectId);
  const { filters, hasFilters, clearFilters } = useBoardFilters();
  const { openTaskId, openTask, closeTask } = useOpenTask();
  // Column for the new task while AddTaskDialog is open.
  const [addTaskStatus, setAddTaskStatus] = useState<TaskStatus | null>(null);

  const labels = [...new Set(tasks?.flatMap((task) => task.labels))].sort();

  return (
    <div className="flex flex-col gap-4">
      <BoardToolbar
        members={project?.members ?? []}
        labels={labels}
        onAddTask={() => setAddTaskStatus("TODO")}
      />

      {hasFilters && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
          <Info className="size-4 shrink-0" aria-hidden />
          Clear filters to move tasks.
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Clear filters
          </button>
        </p>
      )}

      {isPending ? (
        <KanbanBoardSkeleton />
      ) : isError ? (
        <Card className="py-12">
          <ErrorState message="Could not load tasks." onRetry={() => refetch()} />
        </Card>
      ) : (
        <KanbanBoard
          projectId={projectId}
          tasks={hasFilters ? filterTasks(tasks, filters) : tasks}
          dragDisabled={hasFilters}
          onOpenTask={openTask}
          onAddTask={setAddTaskStatus}
        />
      )}

      {/* Reads the task from the loaded board (all tasks, not only filtered ones). */}
      <TaskDetailsSheet openTaskId={openTaskId} tasks={tasks} onClose={closeTask} />

      <AddTaskDialog
        projectId={projectId}
        status={addTaskStatus}
        onClose={() => setAddTaskStatus(null)}
        members={project?.members ?? []}
        labels={labels}
      />
    </div>
  );
}
