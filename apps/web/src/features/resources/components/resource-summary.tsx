"use client";

import { Gauge, TriangleAlert, UserCheck, Users } from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { StatCard, StatCardSkeleton } from "@/components/shared/stat-card";
import { Card } from "@/components/ui/card";
import {
  DEFAULT_RESOURCE_PERIOD,
  useResourceOverview,
} from "@/features/resources/hooks/use-resource-overview";

const GRID_CLASS = "grid gap-4 sm:grid-cols-2 xl:grid-cols-4";

export function ResourceSummary() {
  const { data, isPending, isError, refetch } = useResourceOverview(DEFAULT_RESOURCE_PERIOD);

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
