"use client";

import type { ReactNode } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DEFAULT_RESOURCE_PERIOD,
  useResourceOverview,
} from "@/features/resources/hooks/use-resource-overview";
import { cn } from "@/lib/utils";
import type { ProjectUtilization } from "@/types/resource";

const SKELETON_ROWS = 4;

const FIRST_CELL = "pl-4 sm:pl-6";
const LAST_CELL = "pr-4 text-right sm:pr-6";
// Wide enough for a few members per line; more wrap onto new lines.
const MEMBERS_CELL = "min-w-72 whitespace-normal";

/** Project View: who works on which project in the period, and with what share. */
export function ProjectViewTable() {
  const { data, isPending, isError, refetch } = useResourceOverview(DEFAULT_RESOURCE_PERIOD);

  if (isPending) {
    return (
      <TableCard>
        <TableBody aria-busy="true" aria-label="Loading project allocation">
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <ProjectRowSkeleton key={index} />
          ))}
        </TableBody>
      </TableCard>
    );
  }

  if (isError) {
    return (
      <TitledCard>
        <ErrorState message="Could not load project allocation." onRetry={() => refetch()} />
      </TitledCard>
    );
  }

  if (data.projects.length === 0) {
    return (
      <TitledCard>
        <EmptyState message="No allocations in this period" />
      </TitledCard>
    );
  }

  return (
    <TableCard>
      <TableBody>
        {data.projects.map((utilization) => (
          <ProjectRow key={utilization.project.id} utilization={utilization} />
        ))}
      </TableBody>
    </TableCard>
  );
}

function TitledCard({ children }: { children: ReactNode }) {
  return (
    <Card className="gap-0 py-0">
      {/* Same side padding as the table cells; border-b adds the bottom padding. */}
      <CardHeader className="border-b pt-4 sm:px-6">
        <CardTitle className="font-semibold">Project Allocation</CardTitle>
      </CardHeader>
      {children}
    </Card>
  );
}

function TableCard({ children }: { children: ReactNode }) {
  return (
    <TitledCard>
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className={FIRST_CELL}>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className={MEMBERS_CELL}>Members</TableHead>
            <TableHead className={LAST_CELL}>Total</TableHead>
          </TableRow>
        </TableHeader>
        {children}
      </Table>
    </TitledCard>
  );
}

function ProjectRow({ utilization }: { utilization: ProjectUtilization }) {
  const { project, members, totalPercent } = utilization;

  return (
    <TableRow>
      <TableCell className={cn(FIRST_CELL, "py-3 font-medium")}>{project.name}</TableCell>
      <TableCell>
        <StatusBadge status={project.status} />
      </TableCell>
      <TableCell className={cn(MEMBERS_CELL, "py-3")}>
        <ul className="flex flex-wrap gap-x-4 gap-y-2" aria-label={`${project.name} members`}>
          {members.map(({ member, percent }) => (
            <li key={member.id} className="flex items-center gap-2">
              <UserAvatar user={member} size="sm" />
              <span>{member.name}</span>
              <span className="text-muted-foreground tabular-nums">{percent}%</span>
            </li>
          ))}
        </ul>
      </TableCell>
      <TableCell className={cn(LAST_CELL, "font-medium tabular-nums")}>{totalPercent}%</TableCell>
    </TableRow>
  );
}

/** Mirrors ProjectRow so the table doesn't jump when data arrives. */
function ProjectRowSkeleton() {
  return (
    <TableRow className="hover:bg-transparent" aria-hidden>
      <TableCell className={cn(FIRST_CELL, "py-3")}>
        <Skeleton className="h-4 w-36" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-24 rounded-md" />
      </TableCell>
      <TableCell className={cn(MEMBERS_CELL, "py-3")}>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </TableCell>
      <TableCell className={LAST_CELL}>
        <Skeleton className="ml-auto h-4 w-10" />
      </TableCell>
    </TableRow>
  );
}
