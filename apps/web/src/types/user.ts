export type Role = "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";

export interface User {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  role: Role;
  avatarUrl?: string;
}

/** Minimal user info embedded in other entities (activity, assignees...). */
export type UserSummary = Pick<User, "id" | "name" | "avatarUrl">;
