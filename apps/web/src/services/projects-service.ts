import { ApiError } from "@/services/api-error";
import { dateFromToday } from "@/services/mock/dates";
import { mockUsers } from "@/services/mock/users";
import { mockError, mockResponse } from "@/services/mock-response";
import type { Project, ProjectDetails, ProjectListParams, ProjectSort } from "@/types/project";

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
    members: [mockUsers.ana, mockUsers.marko, mockUsers.jelena, mockUsers.nikola, mockUsers.sara],
    createdAt: dateFromToday(-30),
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
    members: [mockUsers.marko, mockUsers.sara, mockUsers.ivan, mockUsers.bogdan],
    createdAt: dateFromToday(-60),
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
    members: [mockUsers.nikola, mockUsers.ivan, mockUsers.bogdan],
    createdAt: dateFromToday(-4),
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
    members: [mockUsers.jelena, mockUsers.ana],
    createdAt: dateFromToday(-130),
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
    members: [mockUsers.ana, mockUsers.sara],
    createdAt: dateFromToday(-45),
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
    members: [mockUsers.ivan, mockUsers.marko],
    createdAt: dateFromToday(-75),
  },
  {
    id: "p-7",
    name: "Legacy Intranet",
    description: "Old company intranet, replaced by the HR Portal",
    status: "ARCHIVED",
    progress: 100,
    startDate: dateFromToday(-400),
    endDate: dateFromToday(-200),
    icon: "globe",
    color: "neutral",
    members: [mockUsers.bogdan, mockUsers.jelena],
    createdAt: dateFromToday(-420),
  },
];

type ProjectExtras = Omit<ProjectDetails, keyof Project>;

/** Details shown only on the project page, keyed by project id. */
const projectExtras: Record<string, ProjectExtras> = {
  "p-1": {
    overview:
      "A modern e-commerce platform with product catalog, shopping cart, payment integration and admin dashboard.",
    technologies: ["nextjs", "nodejs", "stripe", "tailwind", "typescript"],
    milestones: [
      { id: "m-1", name: "Project Setup", status: "COMPLETED", dueDate: dateFromToday(-18) },
      { id: "m-2", name: "Core Features", status: "IN_PROGRESS", dueDate: dateFromToday(12) },
      { id: "m-3", name: "Payment Integration", status: "PENDING", dueDate: dateFromToday(43) },
      { id: "m-4", name: "Production Release", status: "PENDING", dueDate: dateFromToday(83) },
    ],
    links: [
      {
        id: "l-1",
        type: "github",
        label: "GitHub Repository",
        url: "https://github.com/example/ecommerce-platform",
      },
      {
        id: "l-2",
        type: "figma",
        label: "Figma Design",
        url: "https://www.figma.com/file/example-ecommerce",
      },
      {
        id: "l-3",
        type: "docs",
        label: "API Documentation",
        url: "https://docs.example.com/ecommerce",
      },
      { id: "l-4", type: "preview", label: "Live Preview", url: "https://shop.example.com" },
    ],
  },
  "p-2": {
    overview: "Cross-platform mobile app for customers, built with React Native and Expo.",
    technologies: ["react-native", "expo", "typescript"],
    milestones: [
      { id: "m-5", name: "MVP", status: "COMPLETED", dueDate: dateFromToday(-20) },
      { id: "m-12", name: "Beta Testing", status: "IN_PROGRESS", dueDate: dateFromToday(-3) },
      { id: "m-13", name: "Push Notifications", status: "PENDING", dueDate: dateFromToday(20) },
      { id: "m-14", name: "Offline Mode", status: "PENDING", dueDate: dateFromToday(45) },
      { id: "m-6", name: "Store Release", status: "PENDING", dueDate: dateFromToday(68) },
    ],
    links: [
      {
        id: "l-5",
        type: "github",
        label: "GitHub Repository",
        url: "https://github.com/example/mobile-app",
      },
    ],
  },
  "p-3": {
    overview: "A suite of internal tools for reporting, onboarding and asset tracking.",
    technologies: ["nextjs", "postgresql"],
    milestones: [
      { id: "m-7", name: "Requirements", status: "IN_PROGRESS", dueDate: dateFromToday(8) },
    ],
    links: [],
  },
  "p-4": {
    overview: "Redesigned company website with a CMS for the marketing team.",
    technologies: ["nextjs", "tailwind", "sanity"],
    milestones: [{ id: "m-8", name: "Launch", status: "COMPLETED", dueDate: dateFromToday(-10) }],
    links: [{ id: "l-6", type: "preview", label: "Live Website", url: "https://www.example.com" }],
  },
  "p-5": {
    overview: "Customer relationship management platform for the sales team.",
    technologies: ["react", "nestjs", "postgresql"],
    milestones: [
      { id: "m-9", name: "Contacts Module", status: "COMPLETED", dueDate: dateFromToday(-15) },
      { id: "m-10", name: "Sales Pipeline", status: "IN_PROGRESS", dueDate: dateFromToday(30) },
    ],
    links: [],
  },
  "p-6": {
    overview: "Employee portal for leave requests, documents and onboarding.",
    technologies: ["nextjs", "nestjs"],
    milestones: [
      { id: "m-11", name: "Leave Requests", status: "PENDING", dueDate: dateFromToday(60) },
    ],
    links: [],
  },
  "p-7": {
    overview: "The old company intranet. Archived after the move to the HR Portal.",
    technologies: ["php", "mysql"],
    milestones: [],
    links: [],
  },
};

const EMPTY_EXTRAS: ProjectExtras = { overview: "", technologies: [], milestones: [], links: [] };

/**
 * For other mock services that check the project like the API does
 * (404 for an unknown project, members for assignee checks).
 */
export function findMockProject(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

/** Rejects with a 404 ApiError for an unknown id, the same way the API will respond. */
export function getProject(id: string): Promise<ProjectDetails> {
  const project = projects.find((item) => item.id === id);
  if (!project) {
    return mockError(new ApiError(404, `Project ${id} not found`));
  }
  return mockResponse({ ...project, ...(projectExtras[id] ?? EMPTY_EXTRAS) });
}

const PROJECT_SORTERS: Record<ProjectSort, (a: Project, b: Project) => number> = {
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  name: (a, b) => a.name.localeCompare(b.name),
  deadline: (a, b) => a.endDate.localeCompare(b.endDate),
  progress: (a, b) => b.progress - a.progress,
};

/**
 * Filters and sorts on the "server", the same way the API will.
 * Without a status filter, archived projects are left out.
 */
export function getProjects({ q, status, sort = "newest" }: ProjectListParams = {}): Promise<
  Project[]
> {
  const search = q?.trim().toLowerCase();

  const result = projects
    .filter((project) => (status ? project.status === status : project.status !== "ARCHIVED"))
    .filter(
      (project) =>
        !search ||
        project.name.toLowerCase().includes(search) ||
        project.description.toLowerCase().includes(search),
    )
    .sort(PROJECT_SORTERS[sort]);

  return mockResponse(result);
}
