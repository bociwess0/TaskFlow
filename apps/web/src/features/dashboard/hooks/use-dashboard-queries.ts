"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getProjectProgress,
  getRecentActivity,
  getTaskDistribution,
  getUpcomingDeadlines,
} from "@/services/dashboard-service";

const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  projectProgress: () => [...dashboardKeys.all, "project-progress"] as const,
  taskDistribution: () => [...dashboardKeys.all, "task-distribution"] as const,
  recentActivity: () => [...dashboardKeys.all, "recent-activity"] as const,
  upcomingDeadlines: () => [...dashboardKeys.all, "upcoming-deadlines"] as const,
};

export function useDashboardStats() {
  return useQuery({ queryKey: dashboardKeys.stats(), queryFn: getDashboardStats });
}

export function useProjectProgress() {
  return useQuery({ queryKey: dashboardKeys.projectProgress(), queryFn: getProjectProgress });
}

export function useTaskDistribution() {
  return useQuery({ queryKey: dashboardKeys.taskDistribution(), queryFn: getTaskDistribution });
}

export function useRecentActivity() {
  return useQuery({ queryKey: dashboardKeys.recentActivity(), queryFn: getRecentActivity });
}

export function useUpcomingDeadlines() {
  return useQuery({ queryKey: dashboardKeys.upcomingDeadlines(), queryFn: getUpcomingDeadlines });
}
