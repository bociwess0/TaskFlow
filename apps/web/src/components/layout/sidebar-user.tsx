"use client";

import { UserAvatar } from "@/components/shared/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";

export function SidebarUser() {
  const { data: user, isPending, isError } = useCurrentUser();

  if (isPending) {
    return (
      <div className="flex items-center gap-3 px-3 py-2">
        <Skeleton className="size-10 rounded-full bg-sidebar-accent" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-3.5 w-20 bg-sidebar-accent" />
          <Skeleton className="h-3 w-28 bg-sidebar-accent" />
        </div>
      </div>
    );
  }

  if (isError) {
    return <p className="px-3 py-2 text-xs text-sidebar-foreground">Could not load profile.</p>;
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <UserAvatar user={user} size="lg" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-sidebar-accent-foreground">
          {user.name.split(" ")[0]}
        </p>
        <p className="truncate text-xs text-sidebar-foreground">{user.jobTitle}</p>
      </div>
    </div>
  );
}
