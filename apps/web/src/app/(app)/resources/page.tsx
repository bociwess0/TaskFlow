import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ResourceSummary } from "@/features/resources/components/resource-summary";
import {
  ResourceViews,
  ResourceViewsSkeleton,
} from "@/features/resources/components/resource-views";

export const metadata: Metadata = {
  title: "Resource Management",
};

export default function ResourcesPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <PageHeader
        title="Resource Management"
        description="Monitor team allocation and availability across projects."
      />
      <ResourceSummary />
      {/* The tabs read search params, which are only known at request time. */}
      <Suspense fallback={<ResourceViewsSkeleton />}>
        <ResourceViews />
      </Suspense>
    </div>
  );
}
