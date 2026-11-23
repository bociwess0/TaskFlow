import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ResourceSummary } from "@/features/resources/components/resource-summary";
import { TeamViewTable } from "@/features/resources/components/team-view-table";

export const metadata: Metadata = {
  title: "Resource Management",
};

export default function ResourcesPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <PageHeader
        title="Resource Management"
        description="Monitor team allocation and availability across projects."
      />
      <ResourceSummary />
      <TeamViewTable />
    </div>
  );
}
