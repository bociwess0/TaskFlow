"use client";

import { useParams } from "next/navigation";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { KanbanColumn } from "@/features/tasks/components/kanban-column";
import { useProjectTasks } from "@/features/tasks/hooks/use-project-tasks";
import { TASK_STATUSES } from "@/lib/task-status";

/** Board tab. For now the columns side by side; the real board layout comes in the next step. */
export function ProjectBoard() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: tasks, isPending, isError, refetch } = useProjectTasks(projectId);

  if (isPending) {
    return (
      <div className="flex gap-4 overflow-x-auto" aria-busy="true" aria-label="Loading tasks">
        {TASK_STATUSES.map((status) => (
          <Skeleton key={status} className="h-96 w-72 shrink-0 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="py-12">
        <ErrorState message="Could not load tasks." onRetry={() => refetch()} />
      </Card>
    );
  }

  return (
    <div className="flex items-start gap-4 overflow-x-auto">
      {TASK_STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          // The service returns tasks ordered by status and position.
          tasks={tasks.filter((task) => task.status === status)}
        />
      ))}
    </div>
  );
}
