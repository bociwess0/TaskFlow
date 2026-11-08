import type { Priority, TaskStatus } from "@/types/task";
import type { UserSummary } from "@/types/user";

export interface StatTrend {
  /** Signed change compared to the previous period. */
  change: number;
  unit: "count" | "percent";
  /** Period description, e.g. "this month", "from last week". */
  label?: string;
}

export interface DashboardStat {
  value: number;
  trend: StatTrend;
}

export interface DashboardStats {
  activeProjects: DashboardStat;
  openTasks: DashboardStat;
  teamMembers: DashboardStat;
  /** Logged hours in the current week. */
  hoursThisWeek: DashboardStat;
}

export interface ProjectProgressPoint {
  /** Month start as ISO date (YYYY-MM-DD). */
  month: string;
  /** Average progress (%) of completed projects. */
  completed: number;
  /** Average progress (%) of projects in progress. */
  inProgress: number;
}

export type TaskDistribution = Record<TaskStatus, number>;

export interface ActivityItem {
  id: string;
  actor: UserSummary;
  /** Action text, e.g. "completed a task", "commented on". */
  action: string;
  target?: {
    name: string;
    href: string;
  };
  createdAt: string;
}

export interface UpcomingDeadline {
  id: string;
  title: string;
  projectName: string;
  priority: Priority;
  dueDate: string;
}
