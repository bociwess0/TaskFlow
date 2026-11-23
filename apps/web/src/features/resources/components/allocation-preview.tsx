"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { ArrowRight, CircleAlert, TriangleAlert } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { AllocationCheck } from "@/types/resource";

const ALERT_CLASS = "border-danger/30 bg-danger/10 px-3 py-2.5";

interface AllocationPreviewProps {
  /** False while the form is incomplete or invalid; then no result is shown. */
  isComplete: boolean;
  check: UseQueryResult<AllocationCheck>;
  /** Whether the result belongs to the values in the form now (not a previous one). */
  isCurrent: boolean;
  memberName: string;
}

/**
 * The member's load in the allocation period, before and with the new allocation, and a
 * warning when it would be too high (preventive overallocation warning from the spec).
 */
export function AllocationPreview({
  isComplete,
  check,
  isCurrent,
  memberName,
}: AllocationPreviewProps) {
  return (
    // Results, warnings and errors are announced to screen readers as they change.
    <section
      aria-label="Allocation check"
      aria-live="polite"
      className="rounded-lg border bg-muted/40 p-4 text-sm"
    >
      <PreviewContent
        isComplete={isComplete}
        check={check}
        isCurrent={isCurrent}
        memberName={memberName}
      />
    </section>
  );
}

function PreviewContent({ isComplete, check, isCurrent, memberName }: AllocationPreviewProps) {
  if (!isComplete) {
    return (
      <p className="text-muted-foreground">
        Fill in the form to see the member&apos;s load in this period.
      </p>
    );
  }

  if (check.isError) {
    return (
      <Alert variant="destructive" className={ALERT_CLASS}>
        <CircleAlert aria-hidden />
        <AlertTitle>This allocation can&apos;t be saved</AlertTitle>
        <AlertDescription>{check.error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!check.data) {
    return (
      <div className="flex flex-col gap-2" aria-busy="true">
        <span className="sr-only">Checking allocation...</span>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  const { currentAllocations, currentTotal, newTotal, newStatus } = check.data;

  return (
    <div
      className={cn("flex flex-col gap-3 transition-opacity", !isCurrent && "opacity-60")}
      aria-busy={!isCurrent}
    >
      <div className="flex flex-col gap-1.5">
        <p className="font-medium">Current projects in this period</p>
        {currentAllocations.length === 0 ? (
          <p className="text-muted-foreground">No other projects in this period.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {currentAllocations.map((allocation) => (
              <li key={allocation.allocationId} className="flex justify-between gap-4">
                <span className="truncate">{allocation.projectName}</span>
                <span className="text-muted-foreground tabular-nums">{allocation.percent}%</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t pt-3">
        <span className="tabular-nums">Current {currentTotal}%</span>
        <ArrowRight className="size-4 text-muted-foreground" aria-label="to" />
        <span className="font-medium tabular-nums">New {newTotal}%</span>
        <StatusBadge status={newStatus} className="ml-auto" />
      </div>

      {newStatus === "OVERALLOCATED" && (
        <Alert variant="destructive" className={ALERT_CLASS}>
          <TriangleAlert aria-hidden />
          <AlertTitle>Overallocation</AlertTitle>
          <AlertDescription>
            {memberName} would be allocated {newTotal}% in this period. Lower the allocation, choose
            another member or allocate anyway.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
