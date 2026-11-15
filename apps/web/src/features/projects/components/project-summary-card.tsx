import { CalendarDays } from "lucide-react";
import { AvatarGroup } from "@/components/shared/avatar-group";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/format";
import { PROJECT_STATUS_PROGRESS_CLASS } from "@/lib/project-status";
import type { Project } from "@/types/project";

interface ProjectSummaryCardProps {
  project: Project;
}

/** Progress, members and duration of a project (Overview tab). */
export function ProjectSummaryCard({ project }: ProjectSummaryCardProps) {
  return (
    <Card className="px-5 [--card-spacing:--spacing(5)]">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <Progress
            value={project.progress}
            aria-label={`${project.name} progress`}
            className="h-2"
            indicatorClassName={PROJECT_STATUS_PROGRESS_CLASS[project.status]}
          />
          <span className="w-10 shrink-0 text-right text-sm font-semibold tabular-nums">
            {project.progress}%
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <AvatarGroup users={project.members} max={3} />
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4 shrink-0" aria-hidden />
            <span>
              <span className="sr-only">Duration: </span>
              <time dateTime={project.startDate}>{formatDate(project.startDate)}</time>
              {" – "}
              <time dateTime={project.endDate}>{formatDate(project.endDate)}</time>
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}
