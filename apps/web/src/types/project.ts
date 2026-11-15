import type { UserSummary } from "@/types/user";

export type ProjectStatus = "PLANNING" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";

/** Icon shown on the project card; the UI maps each key to an icon component. */
export type ProjectIcon =
  | "shopping-cart"
  | "smartphone"
  | "wrench"
  | "globe"
  | "contact"
  | "briefcase";

/** Theme color of the project icon. */
export type ProjectColor = "primary" | "success" | "warning" | "danger" | "highlight" | "neutral";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  /** 0–100, calculated from completed tasks. */
  progress: number;
  /** ISO date (YYYY-MM-DD). */
  startDate: string;
  /** ISO date (YYYY-MM-DD); also the project deadline. */
  endDate: string;
  icon: ProjectIcon;
  color: ProjectColor;
  members: UserSummary[];
  /** ISO date (YYYY-MM-DD) the project was created. */
  createdAt: string;
}

export type MilestoneStatus = "COMPLETED" | "IN_PROGRESS" | "PENDING";

export interface Milestone {
  id: string;
  name: string;
  status: MilestoneStatus;
  /** ISO date (YYYY-MM-DD). */
  dueDate: string;
}

export type ProjectLinkType = "github" | "figma" | "docs" | "preview" | "other";

export interface ProjectLink {
  id: string;
  type: ProjectLinkType;
  label: string;
  url: string;
}

/** A single project with everything the project details page shows. */
export interface ProjectDetails extends Project {
  /** Longer description for the Project Description card. */
  overview: string;
  technologies: string[];
  milestones: Milestone[];
  links: ProjectLink[];
}

export type ProjectSort ="newest" | "name" | "deadline" | "progress";

/** Query parameters of the project list (search, status filter, sorting). */
export interface ProjectListParams {
  /** Matches project name or description. */
  q?: string;
  /** Without a status, every project except archived ones is returned. */
  status?: ProjectStatus;
  /** Defaults to "newest". */
  sort?: ProjectSort;
}
