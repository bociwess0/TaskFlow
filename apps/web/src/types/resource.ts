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
