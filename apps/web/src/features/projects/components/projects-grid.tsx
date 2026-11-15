"use client";

import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NewProjectButton } from "@/features/projects/components/new-project-button";
import { ProjectCard } from "@/features/projects/components/project-card";
import { useProjectFilters } from "@/features/projects/hooks/use-project-filters";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { cn } from "@/lib/utils";

const GRID_CLASS = "grid gap-6 sm:grid-cols-2 xl:grid-cols-3";
const SKELETON_COUNT = 6;

export function ProjectsGrid() {
  const { params, hasFilters, clearFilters } = useProjectFilters();
  const { data: projects, isPending, isError, isPlaceholderData, refetch } = useProjects(params);

  if (isPending) {
    return <ProjectsGridSkeleton />;
  }

  if (isError) {
    return (
      <Card className="py-12">
        <ErrorState message="Could not load projects." onRetry={() => refetch()} />
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card className="py-12">
        {hasFilters ? (
          <EmptyState
            icon={SearchX}
            message="No projects match your filters."
            action={
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            message="No projects yet. Create your first project to get started."
            action={<NewProjectButton />}
          />
        )}
      </Card>
    );
  }

  return (
    <div
      className={cn(GRID_CLASS, "transition-opacity", isPlaceholderData && "opacity-60")}
      aria-busy={isPlaceholderData}
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export function ProjectsGridSkeleton() {
  return (
    <div className={GRID_CLASS} aria-busy="true" aria-label="Loading projects">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  );
}

/** Mirrors the ProjectCard layout so the grid doesn't jump when data arrives. */
function ProjectCardSkeleton() {
  return (
    <Card className="px-5 [--card-spacing:--spacing(5)]" aria-hidden>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <Skeleton className="size-9 rounded-lg" />
          <Skeleton className="size-5 rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-6 w-24 rounded-md" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-1.5 flex-1 rounded-full" />
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            <Skeleton className="size-8 rounded-full ring-2 ring-card" />
            <Skeleton className="size-8 rounded-full ring-2 ring-card" />
            <Skeleton className="size-8 rounded-full ring-2 ring-card" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </Card>
  );
}
