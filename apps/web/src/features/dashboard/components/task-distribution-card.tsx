"use client";

import { Cell, Pie, PieChart } from "recharts";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useTaskDistribution } from "@/features/dashboard/hooks/use-dashboard-queries";
import { TASK_STATUSES, TASK_STATUS_COLOR, TASK_STATUS_LABEL } from "@/lib/task-status";

const chartConfig = Object.fromEntries(
  TASK_STATUSES.map((status) => [
    status,
    { label: TASK_STATUS_LABEL[status], color: TASK_STATUS_COLOR[status] },
  ]),
) satisfies ChartConfig;

export function TaskDistributionCard() {
  const { data, isPending, isError, refetch } = useTaskDistribution();

  const segments = data
    ? TASK_STATUSES.map((status) => ({ status, count: data[status] }))
    : [];
  const total = segments.reduce((sum, segment) => sum + segment.count, 0);

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="font-semibold">Task Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex items-center gap-8">
            <Skeleton className="size-44 rounded-full" />
            <div className="flex flex-1 flex-col gap-3">
              {TASK_STATUSES.map((status) => (
                <Skeleton key={status} className="h-4 w-full" />
              ))}
            </div>
          </div>
        ) : isError ? (
          <ErrorState message="Could not load task distribution." onRetry={() => refetch()} />
        ) : total === 0 ? (
          <EmptyState message="No tasks yet." />
        ) : (
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
            <div className="relative size-48 shrink-0">
              <ChartContainer config={chartConfig} className="aspect-square size-full">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent nameKey="status" hideLabel />}
                  />
                  <Pie
                    data={segments}
                    dataKey="count"
                    nameKey="status"
                    innerRadius="62%"
                    outerRadius="100%"
                    strokeWidth={0}
                  >
                    {segments.map((segment) => (
                      <Cell key={segment.status} fill={`var(--color-${segment.status})`} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold tracking-tight">{total}</span>
                <span className="text-xs text-muted-foreground">Total Tasks</span>
              </div>
            </div>

            <ul className="flex w-full flex-col gap-3">
              {segments.map((segment) => (
                <li key={segment.status} className="flex items-center gap-2 text-sm">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: TASK_STATUS_COLOR[segment.status] }}
                    aria-hidden
                  />
                  <span className="flex-1 text-muted-foreground">
                    {TASK_STATUS_LABEL[segment.status]}
                  </span>
                  <span className="font-semibold">{segment.count}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
