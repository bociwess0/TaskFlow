import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { NewProjectButton } from "@/features/projects/components/new-project-button";
import { ProjectsGrid, ProjectsGridSkeleton } from "@/features/projects/components/projects-grid";
import {
  ProjectsToolbar,
  ProjectsToolbarSkeleton,
} from "@/features/projects/components/projects-toolbar";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <PageHeader
        title="Projects"
        description="Manage and track all your projects in one place."
        actions={<NewProjectButton />}
      />
      {/* Toolbar and grid read search params, which are only known at request time. */}
      <Suspense
        fallback={
          <>
            <ProjectsToolbarSkeleton />
            <ProjectsGridSkeleton />
          </>
        }
      >
        <ProjectsToolbar />
        <ProjectsGrid />
      </Suspense>
    </div>
  );
}
