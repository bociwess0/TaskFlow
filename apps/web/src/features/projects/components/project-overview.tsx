"use client";

import { useParams } from "next/navigation";
import { MilestonesCard } from "@/features/projects/components/milestones-card";
import { ProjectDescriptionCard } from "@/features/projects/components/project-description-card";
import { ProjectSummaryCard } from "@/features/projects/components/project-summary-card";
import { QuickLinksCard } from "@/features/projects/components/quick-links-card";
import { useProject } from "@/features/projects/hooks/use-project";

/**
 * Overview tab content. ProjectShell renders it only after the project has loaded,
 * so useProject reads the cached project instead of making a new request.
 */
export function ProjectOverview() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project } = useProject(projectId);

  if (!project) {
    return null;
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      {/* Left column: summary, then milestones. Right column: description and quick links. */}
      <div className="flex flex-col gap-6">
        <ProjectSummaryCard project={project} />
        <MilestonesCard milestones={project.milestones} />
      </div>
      <div className="flex flex-col gap-6">
        <ProjectDescriptionCard project={project} />
        <QuickLinksCard links={project.links} />
      </div>
    </div>
  );
}
