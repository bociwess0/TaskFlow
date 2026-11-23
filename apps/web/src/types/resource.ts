import type { Project } from "@/types/project";
import type { User } from "@/types/user";

/**
 * A member's planned engagement on a project (ProjectMember in the database).
 * The base for resource management: utilization is the sum of a member's allocations.
 */
export interface Allocation {
  id: string;
  userId: string;
  projectId: string;
  /** Share of the member's weekly capacity, e.g. 50 for half time. */
  percent: number;
  /** ISO date (YYYY-MM-DD). */
  startDate: string;
  /** ISO date (YYYY-MM-DD), inclusive. */
  endDate: string;
}

export type UtilizationStatus = "AVAILABLE" | "ACTIVE" | "OVERALLOCATED";

export type ResourcePeriod = "week" | "month" | "quarter";

/** Inclusive range of ISO dates (YYYY-MM-DD). */
export interface DateRange {
  start: string;
  end: string;
}

/** Status boundaries in percent; the admin can change them in organization settings. */
export interface UtilizationThresholds {
  /** Below this a member is AVAILABLE. */
  available: number;
  /** Above this a member is OVERALLOCATED. */
  overallocated: number;
}

/** One of a member's allocations in the overview, with the project it belongs to. */
export interface ProjectAllocation {
  allocationId: string;
  projectId: string;
  projectName: string;
  percent: number;
  /** ISO date (YYYY-MM-DD). */
  startDate: string;
  /** ISO date (YYYY-MM-DD), inclusive. */
  endDate: string;
}

/** A member's utilization in the selected period (a Team View row). */
export interface MemberUtilization {
  member: Pick<User, "id" | "name" | "avatarUrl" | "jobTitle" | "role" | "weeklyCapacity">;
  /** Peak weekly allocation (%) in the period; see getTotalAllocation. */
  totalAllocation: number;
  status: UtilizationStatus;
  /** Planned hours per week at that peak: weekly capacity × total allocation. */
  plannedHours: number;
  /** Projects with an allocation in the period (PLANNING or IN_PROGRESS only). */
  projectCount: number;
  allocations: ProjectAllocation[];
}

/** A member's share of one project in the overview. */
export interface ProjectMemberAllocation {
  member: Pick<User, "id" | "name" | "avatarUrl">;
  /** Peak weekly allocation (%) on this project in the period; see getTotalAllocation. */
  percent: number;
}

/** A project with allocations in the selected period (a Project View row). */
export interface ProjectUtilization {
  project: Pick<Project, "id" | "name" | "status">;
  /** Active members allocated to the project in the period. */
  members: ProjectMemberAllocation[];
  /** Sum of the members' percents. */
  totalPercent: number;
}

export interface ResourceSummary {
  totalMembers: number;
  /** Average of members' total allocation (%), rounded. */
  averageAllocation: number;
  overallocatedCount: number;
  availableCount: number;
}

/** Resources page data for a period (GET /resources/overview?period=). */
export interface ResourceOverview {
  period: ResourcePeriod;
  range: DateRange;
  members: MemberUtilization[];
  /** Only PLANNING and IN_PROGRESS projects with allocations in the period. */
  projects: ProjectUtilization[];
  summary: ResourceSummary;
}

/** A new allocation (POST /allocations); the id is given when it is saved. */
export type CreateAllocationInput = Omit<Allocation, "id">;

/** Result of checking a new allocation before it is saved (POST /allocations/check). */
export interface AllocationCheck {
  /** The member's allocations in the new allocation's period (PLANNING or IN_PROGRESS only). */
  currentAllocations: ProjectAllocation[];
  /** Peak weekly allocation (%) in that period without the new allocation. */
  currentTotal: number;
  /** Peak weekly allocation (%) in that period with the new allocation. */
  newTotal: number;
  /** Utilization status for newTotal; OVERALLOCATED means the dialog shows a warning. */
  newStatus: UtilizationStatus;
}

export interface ResourceOverviewParams {
  period: ResourcePeriod;
}
