"use client";

import { Pencil, SearchX } from "lucide-react";
import { type ReactNode, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { RoleBadge } from "@/components/shared/role-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditMemberDialog } from "@/features/team/components/edit-member-dialog";
import { useTeamFilters } from "@/features/team/hooks/use-team-filters";
import { useTeamMembers } from "@/features/team/hooks/use-team-members";
import { cn } from "@/lib/utils";
import type { TeamMember } from "@/types/team";

const SKELETON_ROWS = 6;

// Email and Projects are hidden on narrow screens so the table fits without horizontal scroll.
const EMAIL_CELL = "hidden md:table-cell";
const PROJECTS_CELL = "hidden text-right sm:table-cell";
const FIRST_CELL = "pl-4 sm:pl-6";
const LAST_CELL = "w-px pr-4 sm:pr-6";

export function TeamMembersTable() {
  const { params, hasFilters, clearFilters } = useTeamFilters();
  const { data: members, isPending, isError, isPlaceholderData, refetch } = useTeamMembers(params);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  if (isPending) {
    return <TeamMembersTableSkeleton />;
  }

  if (isError) {
    return (
      <Card className="py-12">
        <ErrorState message="Could not load team members." onRetry={() => refetch()} />
      </Card>
    );
  }

  if (members.length === 0) {
    return (
      <Card className="py-12">
        {hasFilters ? (
          <EmptyState
            icon={SearchX}
            message="No team members match your filters"
            action={
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <EmptyState message="No team members found" />
        )}
      </Card>
    );
  }

  return (
    <>
      <TableCard>
        <TableBody
          className={cn("transition-opacity", isPlaceholderData && "opacity-60")}
          aria-busy={isPlaceholderData}
        >
          {members.map((member) => (
            <MemberRow key={member.id} member={member} onEdit={() => setEditingMember(member)} />
          ))}
        </TableBody>
      </TableCard>
      <EditMemberDialog member={editingMember} onClose={() => setEditingMember(null)} />
    </>
  );
}

export function TeamMembersTableSkeleton() {
  return (
    <TableCard>
      <TableBody aria-busy="true" aria-label="Loading team members">
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <MemberRowSkeleton key={index} />
        ))}
      </TableBody>
    </TableCard>
  );
}

function TableCard({ children }: { children: ReactNode }) {
  return (
    <Card className="gap-0 py-0">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className={FIRST_CELL}>Name</TableHead>
            <TableHead className={EMAIL_CELL}>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className={PROJECTS_CELL}>Projects</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className={LAST_CELL}>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        {children}
      </Table>
    </Card>
  );
}

interface MemberRowProps {
  member: TeamMember;
  onEdit: () => void;
}

function MemberRow({ member, onEdit }: MemberRowProps) {
  return (
    <TableRow>
      <TableCell className={cn(FIRST_CELL, "py-3 whitespace-normal")}>
        <div className="flex items-center gap-3">
          <UserAvatar user={member} />
          <div className="flex min-w-0 flex-col">
            <span className="font-medium">{member.name}</span>
            <span className="text-xs text-muted-foreground">{member.jobTitle}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className={cn(EMAIL_CELL, "text-muted-foreground")}>{member.email}</TableCell>
      <TableCell>
        <RoleBadge role={member.role} />
      </TableCell>
      <TableCell className={cn(PROJECTS_CELL, "tabular-nums")}>{member.projectCount}</TableCell>
      <TableCell>
        <StatusBadge status={member.status} />
      </TableCell>
      <TableCell className={LAST_CELL}>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={`Edit ${member.name}`}
          onClick={onEdit}
        >
          <Pencil />
        </Button>
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
      <TableCell className={EMAIL_CELL}>
        <Skeleton className="h-4 w-36" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-24 rounded-md" />
      </TableCell>
      <TableCell className={PROJECTS_CELL}>
        <Skeleton className="ml-auto h-4 w-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-14 rounded-md" />
      </TableCell>
      <TableCell className={LAST_CELL}>
        <Skeleton className="size-7 rounded-md" />
      </TableCell>
    </TableRow>
  );
}
