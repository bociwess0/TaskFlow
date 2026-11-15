import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { NewProjectButton } from "@/features/projects/components/new-project-button";
import { ProjectsGrid } from "@/features/projects/components/projects-grid";

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
      <ProjectsGrid />
    </div>
  );
}
