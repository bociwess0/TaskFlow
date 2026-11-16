"use client";

import { useParams } from "next/navigation";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskCard } from "@/features/tasks/components/task-card";
import { useProjectTasks } from "@/features/tasks/hooks/use-project-tasks";

const GRID_CLASS = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

/** Board tab. For now a simple list of task cards; the columns come in the next steps. */
export function ProjectBoard() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: tasks, isPending, isError, refetch } = useProjectTasks(projectId);

  if (isPending) {
    return (
      <div className={GRID_CLASS} aria-busy="true" aria-label="Loading tasks">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
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

  if (tasks.length === 0) {
    return (
      <Card className="py-12">
        <EmptyState message="No tasks yet." />
      </Card>
    );
  }

  return (
    <ul className={GRID_CLASS}>
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard task={task} />
        </li>
      ))}
    </ul>
  );
}
