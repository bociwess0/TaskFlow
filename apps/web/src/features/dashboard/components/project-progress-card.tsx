"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectProgress } from "@/features/dashboard/hooks/use-dashboard-queries";
import { formatMonth } from "@/lib/format";

const chartConfig = {
  completed: { label: "Completed", color: "var(--success)" },
  inProgress: { label: "In Progress", color: "var(--primary)" },
} satisfies ChartConfig;

const CHART_HEIGHT_CLASS = "h-64";

export function ProjectProgressCard() {
  const { data, isPending, isError, refetch } = useProjectProgress();

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="font-semibold">Project Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className={`${CHART_HEIGHT_CLASS} w-full`} />
        ) : isError ? (
          <ErrorState message="Could not load project progress." onRetry={() => refetch()} />
        ) : data.length === 0 ? (
          <EmptyState message="No project data yet." />
        ) : (
          <ChartContainer config={chartConfig} className={`aspect-auto ${CHART_HEIGHT_CLASS} w-full`}>
            <BarChart
              data={data.map((point) => ({ ...point, label: formatMonth(point.month) }))}
              barGap={6}
              margin={{ top: 4, right: 0, bottom: 0, left: -12 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend
                verticalAlign="top"
                align="right"
                content={<ChartLegendContent className="justify-end pt-0 pb-4" />}
              />
              <Bar dataKey="completed" fill="var(--color-completed)" radius={4} barSize={10} />
              <Bar dataKey="inProgress" fill="var(--color-inProgress)" radius={4} barSize={10} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
