import { Archive, Eye, MoreVertical, Pencil } from "lucide-react";
import { AvatarGroup } from "@/components/shared/avatar-group";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { ProjectIcon } from "@/features/projects/components/project-icon";
import { formatDate } from "@/lib/format";
import { PROJECT_STATUS_PROGRESS_CLASS } from "@/lib/project-status";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="px-5 [--card-spacing:--spacing(5)]">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <ProjectIcon icon={project.icon} color={project.color} />
          <ProjectCardMenu projectName={project.name} />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{project.name}</h3>
          <p className="mt-1 truncate text-muted-foreground">{project.description}</p>
        </div>

        <StatusBadge status={project.status} />

        <div className="flex items-center gap-3">
          <Progress
            value={project.progress}
            aria-label={`${project.name} progress`}
            className="h-1.5"
            indicatorClassName={PROJECT_STATUS_PROGRESS_CLASS[project.status]}
          />
          <span className="w-10 shrink-0 text-right text-sm font-medium tabular-nums">
            {project.progress}%
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <AvatarGroup users={project.members} max={2} />
          <time dateTime={project.endDate} className="text-sm text-muted-foreground">
            {formatDate(project.endDate)}
          </time>
        </div>
      </div>
    </Card>
  );
}

function ProjectCardMenu({ projectName }: { projectName: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="-mt-1 -mr-2 text-muted-foreground"
          aria-label={`Open actions for ${projectName}`}
        >
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      {/* Actions are wired up once project details and editing exist. */}
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem disabled>
          <Eye />
          View details
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Pencil />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Archive />
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
