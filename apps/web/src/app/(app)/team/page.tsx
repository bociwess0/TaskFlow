import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { TeamMembersTable } from "@/features/team/components/team-members-table";

export const metadata: Metadata = {
  title: "Team Members",
};

export default function TeamPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <PageHeader title="Team Members" description="Manage your team and their permissions." />
      <TeamMembersTable />
    </div>
  );
}
