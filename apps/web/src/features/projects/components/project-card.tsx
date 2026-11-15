import {
  Archive,
  Briefcase,
  Contact,
  Eye,
  Globe,
  type LucideIcon,
  MoreVertical,
  Pencil,
  ShoppingCart,
  Smartphone,
  Wrench,
} from "lucide-react";
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
import { formatDate } from "@/lib/format";
import { PROJECT_STATUS_PROGRESS_CLASS } from "@/lib/project-status";
import { cn } from "@/lib/utils";
import type { Project, ProjectColor, ProjectIcon } from "@/types/project";

const PROJECT_ICON: Record<ProjectIcon, LucideIcon> = {
  "shopping-cart": ShoppingCart,
  smartphone: Smartphone,
  wrench: Wrench,
  globe: Globe,
  contact: Contact,
  briefcase: Briefcase,
};

const PROJECT_COLOR_CLASS: Record<ProjectColor, string> = {
  primary: "bg-primary/10 text-primary-strong",
  success: "bg-success/10 text-success-strong",
  warning: "bg-warning/15 text-warning-strong",
  danger: "bg-danger/10 text-danger-strong",
  highlight: "bg-highlight/10 text-highlight-strong",
  neutral: "bg-muted text-muted-foreground",
};

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const Icon = PROJECT_ICON[project.icon];

  return (
    <Card className="px-5 [--card-spacing:--spacing(5)]">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-lg",
              PROJECT_COLOR_CLASS[project.color],
            )}
          >
            <Icon className="size-5" aria-hidden />
          </div>
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
