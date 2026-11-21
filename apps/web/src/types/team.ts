import type { Role, User, UserStatus } from "@/types/user";

/** A user as shown in the Team Members table. */
export interface TeamMember extends User {
  /** Number of projects the user is a member of, without archived projects. */
  projectCount: number;
}

/** Query parameters of the team members list (search, role filter). */
export interface TeamMemberListParams {
  /** Matches name or e-mail. */
  q?: string;
  role?: Role;
}

/** New member invitation (POST /team/invitations); the user starts as INVITED. */
export interface InviteMemberInput {
  name: string;
  email: string;
  role: Role;
  /** Empty string when not given. */
  jobTitle: string;
}

/**
 * Changed member (PATCH /team/members/:id). Name and e-mail are not here; users change
 * them themselves in Settings.
 */
export interface UpdateMemberInput {
  userId: string;
  role: Role;
  /** Empty string when not given. */
  jobTitle: string;
  /** Hours per week, WEEKLY_CAPACITY_MIN–WEEKLY_CAPACITY_MAX. */
  weeklyCapacity: number;
}

/** Deactivating or reactivating an account (PATCH /team/members/:id/status). */
export interface SetMemberStatusInput {
  userId: string;
  status: Exclude<UserStatus, "INVITED">;
}
