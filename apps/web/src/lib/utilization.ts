import type { Project, ProjectStatus } from "@/types/project";
import type {
  Allocation,
  DateRange,
  ResourcePeriod,
  UtilizationStatus,
  UtilizationThresholds,
} from "@/types/resource";

/*
 * Utilization rules. On the backend the ASP.NET Core service does this calculation;
 * these pure functions mirror it so mock data behaves the same.
 */

export const DEFAULT_UTILIZATION_THRESHOLDS: UtilizationThresholds = {
  available: 50,
  overallocated: 100,
};

/** Only allocations on these projects count; completed, on-hold and archived ones don't. */
export const ALLOCATING_PROJECT_STATUSES: ProjectStatus[] = ["PLANNING", "IN_PROGRESS"];

/** AVAILABLE below 50%, ACTIVE from 50% to 100%, OVERALLOCATED above 100% (by default). */
export function getUtilizationStatus(
  percent: number,
  thresholds: UtilizationThresholds = DEFAULT_UTILIZATION_THRESHOLDS,
): UtilizationStatus {
  if (percent > thresholds.overallocated) return "OVERALLOCATED";
  if (percent < thresholds.available) return "AVAILABLE";
  return "ACTIVE";
}

/** Both ranges are inclusive ISO dates, so string comparison is enough. */
export function rangesOverlap(a: DateRange, b: DateRange): boolean {
  return a.start <= b.end && a.end >= b.start;
}

/**
 * Allocations of a user that touch the period: on a PLANNING or IN_PROGRESS project and
 * overlapping the period at least one day. For the list of a member's projects; the total
 * comes from getTotalAllocation, which also checks that allocations overlap in time.
 */
export function getCountedAllocations(
  allocations: Allocation[],
  projects: Pick<Project, "id" | "status">[],
  userId: string,
  period: DateRange,
): Allocation[] {
  const countedProjectIds = new Set(
    projects
      .filter((project) => ALLOCATING_PROJECT_STATUSES.includes(project.status))
      .map((project) => project.id),
  );

  return allocations.filter(
    (allocation) =>
      allocation.userId === userId &&
      countedProjectIds.has(allocation.projectId) &&
      rangesOverlap({ start: allocation.startDate, end: allocation.endDate }, period),
  );
}

/**
 * Total allocation (%) of a user in the period, calculated by weeks: for each week
 * (Monday–Sunday, cut to the period) the allocations overlapping it are summed, and the
 * highest weekly sum is the total (peak load). So 60% in January and 60% in March give 60%
 * for the quarter, not 120%, because the member never worked on both at the same time.
 */
export function getTotalAllocation(
  allocations: Allocation[],
  projects: Pick<Project, "id" | "status">[],
  userId: string,
  period: DateRange,
): number {
  const counted = getCountedAllocations(allocations, projects, userId, period);

  return Math.max(
    0,
    ...getWeeks(period).map((week) =>
      counted
        .filter((allocation) =>
          rangesOverlap({ start: allocation.startDate, end: allocation.endDate }, week),
        )
        .reduce((total, allocation) => total + allocation.percent, 0),
    ),
  );
}

/** Weeks (Monday–Sunday) that cover the period; the first and last are cut to the period. */
export function getWeeks(period: DateRange): DateRange[] {
  const weeks: DateRange[] = [];
  let week = getPeriodRange("week", parseIsoDate(period.start));

  while (week.start <= period.end) {
    weeks.push({
      start: week.start < period.start ? period.start : week.start,
      end: week.end > period.end ? period.end : week.end,
    });
    week = getPeriodRange("week", addDays(parseIsoDate(week.start), 7));
  }

  return weeks;
}

/** Local date as YYYY-MM-DD (toISOString would use UTC and can give yesterday). */
export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** YYYY-MM-DD as a local date (new Date("YYYY-MM-DD") would be UTC midnight). */
function parseIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/**
 * Start and end of the period that contains `today` (local dates):
 * week is Monday–Sunday, month and quarter are calendar ones.
 */
export function getPeriodRange(period: ResourcePeriod, today: Date = new Date()): DateRange {
  const year = today.getFullYear();
  const month = today.getMonth();

  switch (period) {
    case "week": {
      // getDay() is 0 for Sunday; the week starts on Monday.
      const daysSinceMonday = (today.getDay() + 6) % 7;
      const start = addDays(today, -daysSinceMonday);
      const end = addDays(start, 6);
      return { start: toIsoDate(start), end: toIsoDate(end) };
    }
    case "month":
      return {
        start: toIsoDate(new Date(year, month, 1)),
        end: toIsoDate(new Date(year, month + 1, 0)),
      };
    case "quarter": {
      const firstMonth = month - (month % 3);
      return {
        start: toIsoDate(new Date(year, firstMonth, 1)),
        end: toIsoDate(new Date(year, firstMonth + 3, 0)),
      };
    }
  }
}
