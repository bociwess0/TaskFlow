"use client";

import type { ReactNode } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { RoleBadge } from "@/components/shared/role-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useResourceOverview } from "@/features/resources/hooks/use-resource-overview";
import { useResourcePeriod } from "@/features/resources/hooks/use-resource-period";
import { UTILIZATION_STATUS_TONE } from "@/lib/utilization-status";
import { cn } from "@/lib/utils";
import type { MemberUtilization } from "@/types/resource";
import type { StatusTone } from "@/types/status";

const SKELETON_ROWS = 6;

const FIRST_CELL = "pl-4 sm:pl-6";
const LAST_CELL = "pr-4 sm:pr-6";
const PROJECTS_CELL = "text-right";

/** Allocation bar color for each tone, so the bar matches the status badge. */
const BAR_CLASS: Record<StatusTone, string> = {
  info: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  highlight: "bg-highlight",
  neutral: "bg-muted-foreground",
};

/** Team View: every active member's allocation in the period. */
export function TeamViewTable() {
  const { period } = useResourcePeriod();
  const { data, isPending, isError, refetch } = useResourceOverview(period);

  if (isPending) {
    return <TeamViewTableSkeleton />;
  }

  if (isError) {
    return (
      <TitledCard>
        <ErrorState message="Could not load team allocation." onRetry={() => refetch()} />
      </TitledCard>
    );
  }

  if (data.members.length === 0) {
    return (
      <TitledCard>
        <EmptyState message="No active team members" />
      </TitledCard>
    );
  }

  return (
    <TableCard>
      <TableBody>
        {data.members.map((member) => (
          <MemberRow key={member.member.id} utilization={member} />
        ))}
      </TableBody>
    </TableCard>
  );
}

export function TeamViewTableSkeleton() {
  return (
    <TableCard>
      <TableBody aria-busy="true" aria-label="Loading team allocation">
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <MemberRowSkeleton key={index} />
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
        <CardTitle className="font-semibold">Team Allocation</CardTitle>
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
            <TableHead className={FIRST_CELL}>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Allocation</TableHead>
            <TableHead className={PROJECTS_CELL}>Projects</TableHead>
            <TableHead className={LAST_CELL}>Status</TableHead>
          </TableRow>
        </TableHeader>
        {children}
      </Table>
    </TitledCard>
  );
}

function MemberRow({ utilization }: { utilization: MemberUtilization }) {
  const { member, totalAllocation, status, projectCount } = utilization;

  return (
    <TableRow>
      <TableCell className={cn(FIRST_CELL, "py-3")}>
        <div className="flex items-center gap-3">
          <UserAvatar user={member} />
          <div className="flex min-w-0 flex-col">
            <span className="font-medium">{member.name}</span>
            <span className="text-xs text-muted-foreground">{member.jobTitle}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <RoleBadge role={member.role} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Progress
            // The bar stops at 100%; the text shows the real value, e.g. 120%.
            value={Math.min(totalAllocation, 100)}
            aria-label={`${member.name} allocation`}
            aria-valuetext={`${totalAllocation}%`}
            className="h-2 w-28 sm:w-36"
            indicatorClassName={BAR_CLASS[UTILIZATION_STATUS_TONE[status]]}
          />
          <span className="w-10 text-sm tabular-nums">{totalAllocation}%</span>
        </div>
      </TableCell>
      <TableCell className={cn(PROJECTS_CELL, "tabular-nums")}>{projectCount}</TableCell>
      <TableCell className={LAST_CELL}>
        <StatusBadge status={status} />
      </TableCell>
    </TableRow>
  );
}

/** Mirrors MemberRow so the table doesn't jump when data arrives. */
function MemberRowSkeleton() {
  return (
    <TableRow className="hover:bg-transparent" aria-hidden>
      <TableCell className={cn(FIRST_CELL, "py-3")}>
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-24 rounded-md" />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-2 w-28 rounded-full sm:w-36" />
          <Skeleton className="h-4 w-10" />
        </div>
      </TableCell>
      <TableCell className={PROJECTS_CELL}>
        <Skeleton className="ml-auto h-4 w-4" />
      </TableCell>
      <TableCell className={LAST_CELL}>
        <Skeleton className="h-6 w-24 rounded-md" />
      </TableCell>
    </TableRow>
  );
}
