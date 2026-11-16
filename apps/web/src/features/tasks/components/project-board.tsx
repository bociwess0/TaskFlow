"use client";

import { useParams } from "next/navigation";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { KanbanBoard, KanbanBoardSkeleton } from "@/features/tasks/components/kanban-board";
import { useProjectTasks } from "@/features/tasks/hooks/use-project-tasks";

/** Board tab: loads the project's tasks and shows them on the Kanban board. */
export function ProjectBoard() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: tasks, isPending, isError, refetch } = useProjectTasks(projectId);

  if (isPending) {
    return <KanbanBoardSkeleton />;
  }

  if (isError) {
    return (
      <Card className="py-12">
        <ErrorState message="Could not load tasks." onRetry={() => refetch()} />
      </Card>
    );
  }

  return <KanbanBoard projectId={projectId} tasks={tasks} />;
}
