"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatLongDate } from "@/lib/format";

function getGreeting(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardGreeting() {
  const { data: user, isPending, isError } = useCurrentUser();

  // Rendered only after the user is loaded on the client, so the time-based text never mismatches SSR.
  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-80" />
      </div>
    );
  }

  const now = new Date();
  const firstName = isError ? null : user.name.split(" ")[0];

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {getGreeting(now)}
          {firstName && `, ${firstName}`} <span aria-hidden>👋</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s what&apos;s happening with your projects today.
        </p>
      </div>
      <p className="text-sm text-muted-foreground sm:pt-2">{formatLongDate(now)}</p>
    </div>
  );
}
