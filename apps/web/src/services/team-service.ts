import { ApiError } from "@/services/api-error";
import { DEFAULT_WEEKLY_CAPACITY, mockUserRecords } from "@/services/mock/users";
import { mockError, mockResponse } from "@/services/mock-response";
import { listMockProjects } from "@/services/projects-service";
import type { InviteMemberInput, TeamMember, TeamMemberListParams } from "@/types/team";
import type { User } from "@/types/user";

let users: User[] = Object.values(mockUserRecords);
let nextUserNumber = users.length + 1;

/** Counts on the "server" like the API will: archived projects don't count. */
function countProjects(userId: string): number {
  return listMockProjects().filter(
    (project) =>
      project.status !== "ARCHIVED" && project.members.some((member) => member.id === userId),
  ).length;
}

function toTeamMember(user: User): TeamMember {
  return { ...user, projectCount: countProjects(user.id) };
}

/** Filters on the "server", the same way the API will (search by name or e-mail, role filter). */
export function getTeamMembers({ q, role }: TeamMemberListParams = {}): Promise<TeamMember[]> {
  const search = q?.trim().toLowerCase();

  const result = users
    .filter((user) => !role || user.role === role)
    .filter(
      (user) =>
        !search ||
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search),
    )
    .map(toTeamMember);

  return mockResponse(result);
}

/**
 * Invites a new member (POST /team/invitations). The user is created as INVITED with the
 * default capacity; the API also sends the invitation e-mail.
 * Like the API: 409 when a user with the same e-mail (case-insensitive) already exists.
 */
export function inviteMember({
  name,
  email,
  role,
  jobTitle,
}: InviteMemberInput): Promise<TeamMember> {
  const normalizedEmail = email.trim().toLowerCase();
  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    return mockError(new ApiError(409, "A member with this email already exists."));
  }

  const user: User = {
    id: `u-${nextUserNumber++}`,
    name: name.trim(),
    email: normalizedEmail,
    jobTitle: jobTitle.trim(),
    role,
    status: "INVITED",
    weeklyCapacity: DEFAULT_WEEKLY_CAPACITY,
  };
  users = [...users, user];

  return mockResponse(toTeamMember(user));
}
