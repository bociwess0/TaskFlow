"use client";

import { FolderOpen, ListTodo, Timer, Users } from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-queries";

const GRID_CLASS = "grid gap-4 sm:grid-cols-2 xl:grid-cols-4";

export function StatsGrid() {
  const { data: stats, isPending, isError, refetch } = useDashboardStats();

  if (isPending) {
    return (
      <div className={GRID_CLASS}>
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index} className="flex-row gap-4 px-5 py-5">
            <Skeleton className="size-10 rounded-lg" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <ErrorState message="Could not load statistics." onRetry={() => refetch()} />
      </Card>
    );
  }

  return (
    <div className={GRID_CLASS}>
      <StatCard label="Active Projects" stat={stats.activeProjects} icon={FolderOpen} tone="success" />
      <StatCard
        label="Open Tasks"
        stat={stats.openTasks}
        icon={ListTodo}
        tone="highlight"
        increaseIsPositive={false}
      />
      <StatCard label="Team Members" stat={stats.teamMembers} icon={Users} tone="primary" />
      <StatCard
        label="Hours This Week"
        stat={stats.hoursThisWeek}
        icon={Timer}
        tone="success"
        formatValue={(value) => `${value}h`}
      />
    </div>
  );
}
