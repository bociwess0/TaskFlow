import {
  getCountedAllocations,
  getPeriodRange,
  getTotalAllocation,
  getUtilizationStatus,
} from "@/lib/utilization";
import { mockAllocations } from "@/services/mock/allocations";
import { mockResponse } from "@/services/mock-response";
import { listMockProjects } from "@/services/projects-service";
import { listMockUsers } from "@/services/team-service";
import type {
  DateRange,
  MemberUtilization,
  ResourceOverview,
  ResourceOverviewParams,
  ResourceSummary,
} from "@/types/resource";
import type { User } from "@/types/user";

function getMemberUtilization(user: User, range: DateRange): MemberUtilization {
  const projects = listMockProjects();
  const counted = getCountedAllocations(mockAllocations, projects, user.id, range);
  const totalAllocation = getTotalAllocation(mockAllocations, projects, user.id, range);
  const projectNames = new Map(projects.map((project) => [project.id, project.name]));

  return {
    member: {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      jobTitle: user.jobTitle,
      role: user.role,
      weeklyCapacity: user.weeklyCapacity,
    },
    totalAllocation,
    status: getUtilizationStatus(totalAllocation),
    // Hours with one decimal, e.g. 40 h × 45% = 18 h.
    plannedHours: Math.round((user.weeklyCapacity * totalAllocation) / 10) / 10,
    projectCount: new Set(counted.map((allocation) => allocation.projectId)).size,
    allocations: counted.map((allocation) => ({
      allocationId: allocation.id,
      projectId: allocation.projectId,
      projectName: projectNames.get(allocation.projectId) ?? "",
      percent: allocation.percent,
      startDate: allocation.startDate,
      endDate: allocation.endDate,
    })),
  };
}

function getSummary(members: MemberUtilization[]): ResourceSummary {
  const total = members.reduce((sum, member) => sum + member.totalAllocation, 0);

  return {
    totalMembers: members.length,
    averageAllocation: members.length ? Math.round(total / members.length) : 0,
    overallocatedCount: members.filter((member) => member.status === "OVERALLOCATED").length,
    availableCount: members.filter((member) => member.status === "AVAILABLE").length,
  };
}

/**
 * Utilization of every active member in the period that contains today. Invited and
 * deactivated users are left out. On the backend the calculation is done by the ASP.NET Core
 * service; NestJS returns its result.
 */
export function getResourceOverview({ period }: ResourceOverviewParams): Promise<ResourceOverview> {
  const range = getPeriodRange(period);
  const members = listMockUsers()
    .filter((user) => user.status === "ACTIVE")
    .map((user) => getMemberUtilization(user, range));

  return mockResponse({ period, range, members, summary: getSummary(members) });
}
