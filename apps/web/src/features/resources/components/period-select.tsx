"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useResourcePeriod } from "@/features/resources/hooks/use-resource-period";
import { isResourcePeriod, RESOURCE_PERIOD_LABEL, RESOURCE_PERIODS } from "@/lib/resource-period";

/** Period of the Resources page (week, month, quarter), kept in ?period=. */
export function PeriodSelect() {
  const { period, setPeriod } = useResourcePeriod();

  return (
    <Select
      value={period}
      onValueChange={(value) => {
        if (isResourcePeriod(value)) setPeriod(value);
      }}
    >
      <SelectTrigger
        aria-label="Period"
        className="w-full bg-card px-3 data-[size=default]:h-10 sm:w-40"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        {RESOURCE_PERIODS.map((option) => (
          <SelectItem key={option} value={option}>
            {RESOURCE_PERIOD_LABEL[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Placeholder while the URL-driven select loads on the client. */
export function PeriodSelectSkeleton() {
  return <Skeleton className="h-10 w-full sm:w-40" />;
}
