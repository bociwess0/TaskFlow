import type { Metadata } from "next";
import { DashboardGreeting } from "@/features/dashboard/components/dashboard-greeting";
import { ProjectProgressCard } from "@/features/dashboard/components/project-progress-card";
import { RecentActivityCard } from "@/features/dashboard/components/recent-activity-card";
import { StatsGrid } from "@/features/dashboard/components/stats-grid";
import { TaskDistributionCard } from "@/features/dashboard/components/task-distribution-card";
import { UpcomingDeadlinesCard } from "@/features/dashboard/components/upcoming-deadlines-card";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <DashboardGreeting />
      <StatsGrid />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ProjectProgressCard />
        </div>
        <div className="lg:col-span-2">
          <TaskDistributionCard />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentActivityCard />
        </div>
        <div className="lg:col-span-2">
          <UpcomingDeadlinesCard />
        </div>
      </div>
    </div>
  );
}
