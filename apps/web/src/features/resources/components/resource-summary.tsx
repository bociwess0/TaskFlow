"use client";

import { Gauge, TriangleAlert, UserCheck, Users } from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { StatCard, StatCardSkeleton } from "@/components/shared/stat-card";
import { Card } from "@/components/ui/card";
import { useResourceOverview } from "@/features/resources/hooks/use-resource-overview";
import type { ResourcePeriod } from "@/types/resource";

const GRID_CLASS = "grid gap-4 sm:grid-cols-2 xl:grid-cols-4";

// Fixed until the period select is added (roadmap 1.6/6).
const PERIOD: ResourcePeriod = "month";

export function ResourceSummary() {
  const { data, isPending, isError, refetch } = useResourceOverview(PERIOD);

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
        <ErrorState message="Could not load resource summary." onRetry={() => refetch()} />
      </Card>
    );
  }

  const { summary } = data;

  return (
    <div className={GRID_CLASS}>
      <StatCard label="Total Members" value={summary.totalMembers} icon={Users} tone="highlight" />
      <StatCard
        label="Utilization Rate"
        value={`${summary.averageAllocation}%`}
        description="Average planned allocation"
        icon={Gauge}
        tone="success"
      />
      <StatCard
        label="Overallocated"
        value={summary.overallocatedCount}
        icon={TriangleAlert}
        tone="danger"
      />
      <StatCard label="Available" value={summary.availableCount} icon={UserCheck} tone="info" />
    </div>
  );
}
