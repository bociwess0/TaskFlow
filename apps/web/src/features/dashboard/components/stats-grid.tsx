"use client";

import { FolderOpen, ListTodo, Timer, Users } from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { StatCard, StatCardSkeleton } from "@/components/shared/stat-card";
import { Card } from "@/components/ui/card";
import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-queries";

const GRID_CLASS = "grid gap-4 sm:grid-cols-2 xl:grid-cols-4";

export function StatsGrid() {
  const { data: stats, isPending, isError, refetch } = useDashboardStats();

  if (isPending) {
    return (
      <div className={GRID_CLASS}>
        {Array.from({ length: 4 }, (_, index) => (
          <StatCardSkeleton key={index} />
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
      <StatCard
        label="Active Projects"
        value={stats.activeProjects.value}
        trend={stats.activeProjects.trend}
        icon={FolderOpen}
        tone="success"
      />
      <StatCard
        label="Open Tasks"
        value={stats.openTasks.value}
        trend={{ ...stats.openTasks.trend, increaseIsPositive: false }}
        icon={ListTodo}
        tone="highlight"
      />
      <StatCard
        label="Team Members"
        value={stats.teamMembers.value}
        trend={stats.teamMembers.trend}
        icon={Users}
        tone="info"
      />
      <StatCard
        label="Hours This Week"
        value={`${stats.hoursThisWeek.value}h`}
        trend={stats.hoursThisWeek.trend}
        icon={Timer}
        tone="success"
      />
    </div>
  );
}
