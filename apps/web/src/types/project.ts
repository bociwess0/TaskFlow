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
}
