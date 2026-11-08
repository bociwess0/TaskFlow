"use client";

import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpcomingDeadlines } from "@/features/dashboard/hooks/use-dashboard-queries";
import { daysUntil, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Priority } from "@/types/task";

/** Deadlines within this many days are highlighted. */
const SOON_THRESHOLD_DAYS = 3;

const PRIORITY_BAR_CLASS: Record<Priority, string> = {
  URGENT: "bg-danger",
  HIGH: "bg-warning",
  MEDIUM: "bg-primary",
  LOW: "bg-muted-foreground/40",
};

export function UpcomingDeadlinesCard() {
  const { data: deadlines, isPending, isError, refetch } = useUpcomingDeadlines();

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="font-semibold">Upcoming Deadlines</CardTitle>
        <CardAction>
          <Link href="/tasks" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <ul className="flex flex-col gap-4">
            {Array.from({ length: 3 }, (_, index) => (
              <li key={index} className="flex items-center gap-3">
                <Skeleton className="h-9 w-1 rounded-full" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </li>
            ))}
          </ul>
        ) : isError ? (
          <ErrorState message="Could not load deadlines." onRetry={() => refetch()} />
        ) : deadlines.length === 0 ? (
          <EmptyState message="No upcoming deadlines." />
        ) : (
          <ul className="flex flex-col divide-y">
            {deadlines.map((deadline) => {
              const isSoon = daysUntil(deadline.dueDate) <= SOON_THRESHOLD_DAYS;
              return (
                <li key={deadline.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span
                    className={cn("h-9 w-1 shrink-0 rounded-full", PRIORITY_BAR_CLASS[deadline.priority])}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{deadline.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{deadline.projectName}</p>
                  </div>
                  <time
                    dateTime={deadline.dueDate}
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium",
                      isSoon ? "border-danger/30 bg-danger/5 text-danger" : "text-muted-foreground",
                    )}
                  >
                    {formatShortDate(deadline.dueDate)}
                  </time>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
