export type Role = "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";

/** INVITED: the invitation was sent but not accepted yet. */
export type UserStatus = "ACTIVE" | "INVITED" | "DEACTIVATED";

export interface User {
  id: string;
  name: string;
  email: string;
  /** Position in the company, e.g. "Frontend Developer"; separate from the system role. */
  jobTitle: string;
  role: Role;
  status: UserStatus;
  /** Working hours per week, the base for resource utilization. */
  weeklyCapacity: number;
  avatarUrl?: string;
}

/** Minimal user info embedded in other entities (activity, assignees...). */
export type UserSummary = Pick<User, "id" | "name" | "avatarUrl">;
