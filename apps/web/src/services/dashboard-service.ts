import { daysFromNow, minutesAgo, monthStart } from "@/services/mock/dates";
import { mockUsers } from "@/services/mock/users";
import { mockResponse } from "@/services/mock-response";
import type {
  ActivityItem,
  DashboardStats,
  ProjectProgressPoint,
  TaskDistribution,
  UpcomingDeadline,
} from "@/types/dashboard";

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
      actor: mockUsers.ana,
      action: "completed a task",
      createdAt: minutesAgo(2),
    },
    {
      id: "a-2",
      actor: mockUsers.marko,
      action: "commented on",
      target: { name: "Design system", href: "/tasks/t-12" },
      createdAt: minutesAgo(15),
    },
    {
      id: "a-3",
      actor: mockUsers.bogdan,
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
