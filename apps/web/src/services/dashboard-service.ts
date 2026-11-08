import { mockResponse } from "@/services/mock-response";
import type {
  ActivityItem,
  DashboardStats,
  ProjectProgressPoint,
  TaskDistribution,
  UpcomingDeadline,
} from "@/types/dashboard";

const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * MINUTE_MS;

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * MINUTE_MS).toISOString();
}

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * DAY_MS).toISOString();
}

/** First day of the month `offset` months before the current one, as YYYY-MM-DD. */
function monthStart(offset: number): string {
  const now = new Date();
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth() - offset, 1));
  return date.toISOString().slice(0, 10);
}

export function getDashboardStats(): Promise<DashboardStats> {
  return mockResponse({
    activeProjects: { value: 8, trend: { change: 2, unit: "count", label: "this month" } },
    openTasks: { value: 24, trend: { change: 6, unit: "count", label: "from last week" } },
    teamMembers: { value: 12, trend: { change: 1, unit: "count", label: "new" } },
    hoursThisWeek: { value: 156, trend: { change: 12, unit: "percent" } },
  });
}

export function getProjectProgress(): Promise<ProjectProgressPoint[]> {
  const values: Array<[completed: number, inProgress: number]> = [
    [50, 78],
    [30, 72],
    [32, 55],
    [32, 52],
    [38, 63],
    [52, 74],
  ];
  return mockResponse(
    values.map(([completed, inProgress], index) => ({
      month: monthStart(values.length - 1 - index),
      completed,
      inProgress,
    })),
  );
}

export function getTaskDistribution(): Promise<TaskDistribution> {
  return mockResponse({ TODO: 12, IN_PROGRESS: 14, REVIEW: 8, DONE: 8 });
}

export function getRecentActivity(): Promise<ActivityItem[]> {
  return mockResponse([
    {
      id: "a-1",
      actor: { id: "u-2", name: "Ana Markovic" },
      action: "completed a task",
      createdAt: minutesAgo(2),
    },
    {
      id: "a-2",
      actor: { id: "u-3", name: "Marko Petrovic" },
      action: "commented on",
      target: { name: "Design system", href: "/tasks/t-12" },
      createdAt: minutesAgo(15),
    },
    {
      id: "a-3",
      actor: { id: "u-1", name: "Bogdan Djordjevic" },
      action: "created a new project",
      target: { name: "E-commerce Platform", href: "/projects/p-1" },
      createdAt: minutesAgo(60),
    },
  ]);
}

export function getUpcomingDeadlines(): Promise<UpcomingDeadline[]> {
  return mockResponse([
    {
      id: "t-21",
      title: "UI/UX Design",
      projectName: "Website Redesign",
      priority: "URGENT",
      dueDate: daysFromNow(2),
    },
    {
      id: "t-34",
      title: "API Integration",
      projectName: "Mobile App",
      priority: "MEDIUM",
      dueDate: daysFromNow(3),
    },
    {
      id: "t-40",
      title: "Client Presentation",
      projectName: "Internal Tools",
      priority: "HIGH",
      dueDate: daysFromNow(9),
    },
  ]);
}
