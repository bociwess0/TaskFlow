import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { AllocationDialog } from "@/features/resources/components/allocation-dialog";
import { PeriodSelect, PeriodSelectSkeleton } from "@/features/resources/components/period-select";
import {
  ResourceSummary,
  ResourceSummarySkeleton,
} from "@/features/resources/components/resource-summary";
import {
  ResourceViews,
  ResourceViewsSkeleton,
} from "@/features/resources/components/resource-views";

export const metadata: Metadata = {
  title: "Resource Management",
};

// The period select and everything below the title read search params (?period=, ?view=), which are only known
// at request time, so it renders behind Suspense with skeletons of the same size.
export default function ResourcesPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <PageHeader
        title="Resource Management"
        description="Monitor team allocation and availability across projects."
        actions={
          // Two columns on mobile, like the Team toolbar.
          <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto">
            <Suspense fallback={<PeriodSelectSkeleton />}>
              <PeriodSelect />
            </Suspense>
            <AllocationDialog />
          </div>
        }
      />
      <Suspense
        fallback={
          <>
            <ResourceSummarySkeleton />
            <ResourceViewsSkeleton />
          </>
        }
      >
        <ResourceSummary />
        <ResourceViews />
      </Suspense>
    </div>
  );
}
