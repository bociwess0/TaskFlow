"use client";

import { Plus } from "lucide-react";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeamFilters } from "@/features/team/hooks/use-team-filters";
import { ROLE_LABEL, ROLES } from "@/lib/user-role";
import type { Role } from "@/types/user";

const ALL_ROLES = "ALL";

export function TeamToolbar() {
  const { params, setParams } = useTeamFilters();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <SearchInput
        value={params.q ?? ""}
        onSearch={(q) => setParams({ q })}
        placeholder="Search team members..."
      />

      <div className="grid grid-cols-2 gap-3 sm:flex">
        <Select
          value={params.role ?? ALL_ROLES}
          onValueChange={(value) =>
            setParams({ role: value === ALL_ROLES ? undefined : (value as Role) })
          }
        >
          <SelectTrigger
            aria-label="Filter by role"
            className="w-full bg-card px-3 data-[size=default]:h-10 sm:w-44"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" align="end">
            <SelectItem value={ALL_ROLES}>All roles</SelectItem>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {ROLE_LABEL[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* No action yet; InviteMemberDialog comes in the next step. */}
        <Button size="lg" className="h-10 px-4">
          <Plus data-icon="inline-start" />
          Invite Member
        </Button>
      </div>
    </div>
  );
}

/** Placeholder while the URL-driven toolbar loads on the client. */
export function TeamToolbarSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Skeleton className="h-10 w-full sm:max-w-xs" />
      <div className="grid grid-cols-2 gap-3 sm:flex">
        <Skeleton className="h-10 sm:w-44" />
        <Skeleton className="h-10 sm:w-36" />
      </div>
    </div>
  );
}
