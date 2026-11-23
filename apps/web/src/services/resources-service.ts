import {
  ALLOCATING_PROJECT_STATUSES,
  getCountedAllocations,
  getPeriodRange,
  getTotalAllocation,
  getUtilizationStatus,
} from "@/lib/utilization";
import { ApiError } from "@/services/api-error";
import { mockAllocations } from "@/services/mock/allocations";
import { mockError, mockResponse } from "@/services/mock-response";
import {
  addMockProjectMember,
  findMockProject,
  listMockProjects,
} from "@/services/projects-service";
import { listMockUsers } from "@/services/team-service";
import type {
  Allocation,
  AllocationCheck,
  CreateAllocationInput,
  DateRange,
  MemberUtilization,
  ProjectAllocation,
  ProjectUtilization,
  ResourceOverview,
  ResourceOverviewParams,
  ResourceSummary,
} from "@/types/resource";
import type { Project } from "@/types/project";
import type { User } from "@/types/user";

/** Allocations with their project names, as the overview and the check return them. */
function toProjectAllocations(allocations: Allocation[]): ProjectAllocation[] {
  const projectNames = new Map(listMockProjects().map((project) => [project.id, project.name]));

  return allocations.map((allocation) => ({
    allocationId: allocation.id,
    projectId: allocation.projectId,
    projectName: projectNames.get(allocation.projectId) ?? "",
    percent: allocation.percent,
    startDate: allocation.startDate,
    endDate: allocation.endDate,
  }));
}

function getMemberUtilization(user: User, range: DateRange): MemberUtilization {
  const projects = listMockProjects();
  const counted = getCountedAllocations(mockAllocations, projects, user.id, range);
  const totalAllocation = getTotalAllocation(mockAllocations, projects, user.id, range);

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
    allocations: toProjectAllocations(counted),
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

type AllocationValidation = { error: ApiError } | { error: null; user: User; project: Project };

/**
 * Rules a new allocation must pass, shared by checkAllocation and createAllocation so the check
 * returns the same error (404 / 409 / 400) the save would. Overallocation is not one of them.
 * Returns the member and project when the input is valid.
 */
function validateAllocation(input: CreateAllocationInput): AllocationValidation {
  const user = listMockUsers().find((item) => item.id === input.userId);
  const project = findMockProject(input.projectId);

  if (!user) return { error: new ApiError(404, "Member not found.") };
  if (!project) return { error: new ApiError(404, "Project not found.") };

  // ProjectMember: the same user can't be on the same project twice.
  const isMember =
    project.members.some((member) => member.id === user.id) ||
    mockAllocations.some(
      (allocation) => allocation.userId === user.id && allocation.projectId === project.id,
    );
  if (isMember) {
    return { error: new ApiError(409, `${user.name} is already on ${project.name}.`) };
  }

  if (user.status !== "ACTIVE") {
    return { error: new ApiError(400, "Only active members can be allocated.") };
  }
  if (!ALLOCATING_PROJECT_STATUSES.includes(project.status)) {
    return { error: new ApiError(400, "Members can only be allocated to active projects.") };
  }
  if (!Number.isInteger(input.percent) || input.percent < 1 || input.percent > 100) {
    return { error: new ApiError(400, "Allocation must be a whole number from 1 to 100.") };
  }
  if (input.endDate < input.startDate) {
    return { error: new ApiError(400, "End date can't be before the start date.") };
  }
  if (input.startDate < project.startDate || input.endDate > project.endDate) {
    return { error: new ApiError(400, "The allocation must be within the project period.") };
  }

  return { error: null, user, project };
}

/**
 * Checks a new allocation before it is saved: the member's current load in the new
 * allocation's period and the load with it. The new total is the peak weekly sum, the same
 * rule as getTotalAllocation everywhere else. An input the save would reject fails with the
 * same error instead of returning a result. On the backend the ASP.NET Core service does
 * this calculation (e.g. POST /allocations/check, called through NestJS).
 */
export function checkAllocation(input: CreateAllocationInput): Promise<AllocationCheck> {
  const validation = validateAllocation(input);
  if (validation.error) return mockError(validation.error);

  const projects = listMockProjects();
  const range: DateRange = { start: input.startDate, end: input.endDate };
  const candidate: Allocation = { id: "new", ...input };

  const counted = getCountedAllocations(mockAllocations, projects, input.userId, range);
  const currentTotal = getTotalAllocation(mockAllocations, projects, input.userId, range);
  const newTotal = getTotalAllocation(
    [...mockAllocations, candidate],
    projects,
    input.userId,
    range,
  );

  return mockResponse({
    currentAllocations: toProjectAllocations(counted),
    currentTotal,
    newTotal,
    newStatus: getUtilizationStatus(newTotal),
  });
}

let nextAllocationNumber = mockAllocations.length + 1;

/**
 * Saves a new allocation (POST /allocations), which also makes the user a project member.
 * Overallocation is not rejected: the project manager may knowingly confirm it after the
 * warning from checkAllocation. The API checks the same rules (validateAllocation).
 */
export function createAllocation(input: CreateAllocationInput): Promise<Allocation> {
  const validation = validateAllocation(input);
  if (validation.error) return mockError(validation.error);
  const { user, project } = validation;

  const allocation: Allocation = { id: `a-${nextAllocationNumber++}`, ...input };
  mockAllocations.push(allocation);
  addMockProjectMember(project.id, { id: user.id, name: user.name, avatarUrl: user.avatarUrl });

  return mockResponse(allocation);
}
