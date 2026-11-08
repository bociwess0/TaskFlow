"use client";

import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecentActivity } from "@/features/dashboard/hooks/use-dashboard-queries";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatRelativeTime } from "@/lib/format";

export function RecentActivityCard() {
  const { data: activity, isPending, isError, refetch } = useRecentActivity();
  const { data: currentUser } = useCurrentUser();

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <ul className="flex flex-col gap-5">
            {Array.from({ length: 3 }, (_, index) => (
              <li key={index} className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </li>
            ))}
          </ul>
        ) : isError ? (
          <ErrorState message="Could not load recent activity." onRetry={() => refetch()} />
        ) : activity.length === 0 ? (
          <EmptyState message="No recent activity." />
        ) : (
          <ul className="flex flex-col gap-5">
            {activity.map((item) => {
              const isCurrentUser = item.actor.id === currentUser?.id;
              return (
                <li key={item.id} className="flex items-start gap-3">
                  <UserAvatar user={item.actor} />
                  <div className="min-w-0 text-sm">
                    <p>
                      <span className="font-medium">{isCurrentUser ? "You" : item.actor.name}</span>{" "}
                      <span className="text-muted-foreground">{item.action}</span>
                      {item.target && (
                        <>
                          {" "}
                          <Link
                            href={item.target.href}
                            className="font-medium text-primary hover:underline"
                          >
                            {item.target.name}
                          </Link>
                        </>
                      )}
                    </p>
                    <time dateTime={item.createdAt} className="text-xs text-muted-foreground">
                      {formatRelativeTime(item.createdAt)}
                    </time>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
