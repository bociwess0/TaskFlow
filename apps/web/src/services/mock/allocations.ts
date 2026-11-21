import { monthEnd, monthStart } from "@/services/mock/dates";
import { mockUsers } from "@/services/mock/users";
import { listMockProjects } from "@/services/projects-service";
import type { Allocation } from "@/types/resource";

const { ana, bogdan, ivan, jelena, marko, nikola, sara } = mockUsers;

interface AllocationSeed {
  userId: string;
  projectId: string;
  percent: number;
  /** Only part of the project period; by default the allocation follows the project. */
  period?: { startDate: string; endDate: string };
}

/*
 * Every project member has an allocation. Totals on active projects (PLANNING, IN_PROGRESS)
 * give varied statuses:
 * - Ana 120% (E-commerce 70 + CRM 50): overallocated
 * - Marko 80% (E-commerce 50 + Mobile 30; HR Portal is on hold): active
 * - Jelena 60% (E-commerce; Marketing Website is completed): active
 * - Sara 90% (E-commerce 40 + Mobile 30 + CRM 20 this month only): active
 * - Ivan 70% (Mobile 40 + Internal Tools 30): active
 * - Nikola 40% (E-commerce 25 + Internal Tools 15): available
 * - Bogdan 40% (Mobile 20 + Internal Tools 20): available
 * Internal Tools starts next week, so it doesn't count in the current week yet.
 */
const seeds: AllocationSeed[] = [
  // E-commerce Platform (IN_PROGRESS)
  { userId: ana.id, projectId: "p-1", percent: 70 },
  { userId: marko.id, projectId: "p-1", percent: 50 },
  { userId: jelena.id, projectId: "p-1", percent: 60 },
  { userId: nikola.id, projectId: "p-1", percent: 25 },
  { userId: sara.id, projectId: "p-1", percent: 40 },
  // Mobile App (IN_PROGRESS)
  { userId: marko.id, projectId: "p-2", percent: 30 },
  { userId: sara.id, projectId: "p-2", percent: 30 },
  { userId: ivan.id, projectId: "p-2", percent: 40 },
  { userId: bogdan.id, projectId: "p-2", percent: 20 },
  // Internal Tools (PLANNING)
  { userId: nikola.id, projectId: "p-3", percent: 15 },
  { userId: ivan.id, projectId: "p-3", percent: 30 },
  { userId: bogdan.id, projectId: "p-3", percent: 20 },
  // Marketing Website (COMPLETED): doesn't count
  { userId: jelena.id, projectId: "p-4", percent: 40 },
  { userId: ana.id, projectId: "p-4", percent: 30 },
  // CRM System (IN_PROGRESS)
  { userId: ana.id, projectId: "p-5", percent: 50 },
  {
    userId: sara.id,
    projectId: "p-5",
    percent: 20,
    period: { startDate: monthStart(0), endDate: monthEnd(0) },
  },
  // HR Portal (ON_HOLD): doesn't count
  { userId: ivan.id, projectId: "p-6", percent: 30 },
  { userId: marko.id, projectId: "p-6", percent: 20 },
  // Legacy Intranet (ARCHIVED): doesn't count
  { userId: bogdan.id, projectId: "p-7", percent: 50 },
  { userId: jelena.id, projectId: "p-7", percent: 50 },
];

const projectPeriods = new Map(
  listMockProjects().map((project) => [
    project.id,
    { startDate: project.startDate, endDate: project.endDate },
  ]),
);

/** Mock allocations shared by mock services (resources now, project members later). */
export const mockAllocations: Allocation[] = seeds.map((seed, index) => {
  const projectPeriod = projectPeriods.get(seed.projectId);
  if (!projectPeriod) {
    throw new Error(`Mock allocation for unknown project ${seed.projectId}`);
  }
  return {
    id: `a-${index + 1}`,
    userId: seed.userId,
    projectId: seed.projectId,
    percent: seed.percent,
    ...(seed.period ?? projectPeriod),
  };
});
