"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectViewTable } from "@/features/resources/components/project-view-table";
import {
  TeamViewTable,
  TeamViewTableSkeleton,
} from "@/features/resources/components/team-view-table";
import { isResourceView, useResourceView } from "@/features/resources/hooks/use-resource-view";

// Line tabs in the primary color, as in the design.
const TRIGGER_CLASS = "flex-none px-3 data-active:text-primary after:bg-primary";

/** Team View / Project View tabs; the selected one is kept in ?view=. */
export function ResourceViews() {
  const { view, setView } = useResourceView();

  return (
    <Tabs
      value={view}
      onValueChange={(value) => {
        if (isResourceView(value)) setView(value);
      }}
      className="gap-4"
    >
      <TabsList variant="line" className="w-full justify-start rounded-none border-b">
        <TabsTrigger value="team" className={TRIGGER_CLASS}>
          Team View
        </TabsTrigger>
        <TabsTrigger value="project" className={TRIGGER_CLASS}>
          Project View
        </TabsTrigger>
      </TabsList>
      <TabsContent value="team">
        <TeamViewTable />
      </TabsContent>
      <TabsContent value="project">
        <ProjectViewTable />
      </TabsContent>
    </Tabs>
  );
}

/** Shown until search params are known; the default view is Team View. */
export function ResourceViewsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-8 items-center gap-4 border-b">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
      <TeamViewTableSkeleton />
    </div>
  );
}
