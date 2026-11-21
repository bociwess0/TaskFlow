import type { Role, User } from "@/types/user";

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
