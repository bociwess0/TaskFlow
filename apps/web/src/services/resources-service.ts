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
  ProjectUtilization,
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

/**
 * Projects with allocations of the given users in the period. A member's percent on a project
 * is the peak weekly sum of their allocations on it, so two allocations on the same project in
 * different parts of the period are not added up.
 */
function getProjectUtilizations(users: User[], range: DateRange): ProjectUtilization[] {
  const projects = listMockProjects();

  return projects.flatMap((project) => {
    const projectAllocations = mockAllocations.filter(
      (allocation) => allocation.projectId === project.id,
    );
    // getTotalAllocation skips projects that are not PLANNING or IN_PROGRESS (0%).
    const members = users.flatMap((user) => {
      const percent = getTotalAllocation(projectAllocations, projects, user.id, range);
      return percent > 0
        ? [{ member: { id: user.id, name: user.name, avatarUrl: user.avatarUrl }, percent }]
        : [];
    });

    if (members.length === 0) return [];

    return [
      {
        project: { id: project.id, name: project.name, status: project.status },
        members,
        totalPercent: members.reduce((sum, member) => sum + member.percent, 0),
      },
    ];
  });
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
 * Utilization of every active member and project in the period that contains today. Invited
 * and deactivated users are left out. On the backend the calculation is done by the ASP.NET Core
 * service; NestJS returns its result.
 */
export function getResourceOverview({ period }: ResourceOverviewParams): Promise<ResourceOverview> {
  const range = getPeriodRange(period);
  const activeUsers = listMockUsers().filter((user) => user.status === "ACTIVE");
  const members = activeUsers.map((user) => getMemberUtilization(user, range));
  const projects = getProjectUtilizations(activeUsers, range);

  return mockResponse({ period, range, members, projects, summary: getSummary(members) });
}
