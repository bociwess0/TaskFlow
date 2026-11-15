import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { ProjectHeaderSkeleton } from "@/features/projects/components/project-header";
import { ProjectShell } from "@/features/projects/components/project-shell";

export const metadata: Metadata = {
  title: "Project",
};

/** Shared by every project tab (Overview, Board, ...). */
export default function ProjectLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      {/* The project id comes from the URL, which is only known at request time. */}
      <Suspense fallback={<ProjectHeaderSkeleton />}>
        <ProjectShell>{children}</ProjectShell>
      </Suspense>
    </div>
  );
}
