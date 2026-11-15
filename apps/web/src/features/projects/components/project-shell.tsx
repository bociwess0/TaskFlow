"use client";

import { FolderX } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ProjectHeader,
  ProjectHeaderSkeleton,
} from "@/features/projects/components/project-header";
import { useProject } from "@/features/projects/hooks/use-project";
import { isNotFoundError } from "@/services/api-error";

interface ProjectShellProps {
  children: ReactNode;
}

/** Loads the project for every project tab: header and tabs, then the tab content. */
export function ProjectShell({ children }: ProjectShellProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isPending, isError, error, refetch } = useProject(projectId);

  if (isPending) {
    return <ProjectHeaderSkeleton />;
  }

  if (isError) {
    return (
      <Card className="py-12">
        {isNotFoundError(error) ? (
          <EmptyState
            icon={FolderX}
            message="Project not found"
            action={
              <Button variant="outline" asChild>
                <Link href="/projects">Back to projects</Link>
              </Button>
            }
          />
        ) : (
          <ErrorState message="Could not load the project." onRetry={() => refetch()} />
        )}
      </Card>
    );
  }

  return (
    <>
      <ProjectHeader project={project} />
      {children}
    </>
  );
}
