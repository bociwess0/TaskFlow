import type { StatusTone } from "@/types/status";
import type { Role } from "@/types/user";

export const ROLES: Role[] = ["ADMIN", "PROJECT_MANAGER", "TEAM_MEMBER"];

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  PROJECT_MANAGER: "Project Manager",
  TEAM_MEMBER: "Team Member",
};

/** Badge tone of each system role. */
export const ROLE_TONE: Record<Role, StatusTone> = {
  ADMIN: "highlight",
  PROJECT_MANAGER: "info",
  TEAM_MEMBER: "neutral",
};
