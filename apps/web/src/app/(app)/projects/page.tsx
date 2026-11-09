import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <PageHeader
        title="Projects"
        description="Manage and track all your projects in one place."
        actions={
          <Button size="lg" className="h-10 px-4">
            <Plus data-icon="inline-start" />
            New Project
          </Button>
        }
      />
    </div>
  );
}
