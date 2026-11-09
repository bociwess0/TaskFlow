import { mockResponse } from "@/services/mock-response";
import type { Project } from "@/types/project";
import type { UserSummary } from "@/types/user";

/** Local date `days` from today as YYYY-MM-DD, so mock deadlines stay current. */
function dateFromToday(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

const users = {
  bogdan: { id: "u-1", name: "Bogdan Djordjevic" },
  ana: { id: "u-2", name: "Ana Markovic" },
  marko: { id: "u-3", name: "Marko Petrovic" },
  jelena: { id: "u-4", name: "Jelena Ilic" },
  nikola: { id: "u-5", name: "Nikola Radovic" },
  sara: { id: "u-6", name: "Sara Jovanovic" },
  ivan: { id: "u-7", name: "Ivan Stojanovic" },
} satisfies Record<string, UserSummary>;

const projects: Project[] = [
  {
    id: "p-1",
    name: "E-commerce Platform",
    description: "Modern online store with Next.js",
    status: "IN_PROGRESS",
    progress: 70,
    startDate: dateFromToday(-22),
    endDate: dateFromToday(83),
    icon: "shopping-cart",
    color: "success",
    members: [users.ana, users.marko, users.jelena, users.nikola, users.sara],
  },
  {
    id: "p-2",
    name: "Mobile App",
    description: "React Native application",
    status: "IN_PROGRESS",
    progress: 45,
    startDate: dateFromToday(-53),
    endDate: dateFromToday(68),
    icon: "smartphone",
    color: "primary",
    members: [users.marko, users.sara, users.ivan, users.bogdan],
  },
  {
    id: "p-3",
    name: "Internal Tools",
    description: "Company internal tools suite",
    status: "PLANNING",
    progress: 10,
    startDate: dateFromToday(8),
    endDate: dateFromToday(119),
    icon: "wrench",
    color: "neutral",
    members: [users.nikola, users.ivan, users.bogdan],
  },
  {
    id: "p-4",
    name: "Marketing Website",
    description: "New company website",
    status: "COMPLETED",
    progress: 100,
    startDate: dateFromToday(-120),
    endDate: dateFromToday(-10),
    icon: "globe",
    color: "primary",
    members: [users.jelena, users.ana],
  },
  {
    id: "p-5",
    name: "CRM System",
    description: "Customer management platform",
    status: "IN_PROGRESS",
    progress: 60,
    startDate: dateFromToday(-40),
    endDate: dateFromToday(78),
    icon: "contact",
    color: "highlight",
    members: [users.ana, users.sara],
  },
  {
    id: "p-6",
    name: "HR Portal",
    description: "Employee management system",
    status: "ON_HOLD",
    progress: 30,
    startDate: dateFromToday(-60),
    endDate: dateFromToday(144),
    icon: "briefcase",
    color: "primary",
    members: [users.ivan, users.marko],
  },
];

export function getProjects(): Promise<Project[]> {
  return mockResponse(projects);
}
