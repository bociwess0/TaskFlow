import { ArrowLeft, ChevronRight, Pencil } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectIcon } from "@/features/projects/components/project-icon";
import { ProjectTabs } from "@/features/projects/components/project-tabs";
import type { Project } from "@/types/project";

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <header className="flex flex-col gap-5">
      <ProjectBreadcrumb current={project.name} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <ProjectIcon icon={project.icon} color={project.color} size="lg" />
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
              {project.name}
            </h1>
            <p className="mt-1 text-muted-foreground">{project.description}</p>
          </div>
        </div>
        {/* Wired up once project editing exists. */}
        <Button size="lg" className="h-10 shrink-0 self-start px-4">
          <Pencil data-icon="inline-start" />
          Edit Project
        </Button>
      </div>

      <ProjectTabs projectId={project.id} />
    </header>
  );
}

export function ProjectHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-busy="true" aria-label="Loading project">
      <ProjectBreadcrumb current={<Skeleton className="h-4 w-32" />} />
      <div className="flex items-center gap-4">
        <Skeleton className="size-14 rounded-xl" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
      </div>
      <div className="flex h-11 items-center gap-6 border-b">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-4 w-14" />
        ))}
      </div>
    </div>
  );
}

function ProjectBreadcrumb({ current }: { current: ReactNode }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        <li>
          <Link
            href="/projects"
            className="flex items-center gap-1.5 rounded-md transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Projects
          </Link>
        </li>
        <li aria-hidden>
          <ChevronRight className="size-4" />
        </li>
        <li aria-current="page" className="min-w-0 truncate text-foreground">
          {current}
        </li>
      </ol>
    </nav>
  );
}
