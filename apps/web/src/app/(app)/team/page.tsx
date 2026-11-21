import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import {
  TeamMembersTable,
  TeamMembersTableSkeleton,
} from "@/features/team/components/team-members-table";
import { TeamToolbar, TeamToolbarSkeleton } from "@/features/team/components/team-toolbar";

export const metadata: Metadata = {
  title: "Team Members",
};

export default function TeamPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <PageHeader title="Team Members" description="Manage your team and their permissions." />
      {/* Toolbar and table read search params, which are only known at request time. */}
      <Suspense
        fallback={
          <>
            <TeamToolbarSkeleton />
            <TeamMembersTableSkeleton />
          </>
        }
      >
        <TeamToolbar />
        <TeamMembersTable />
      </Suspense>
    </div>
  );
}
