import { WEEKLY_CAPACITY_MAX, WEEKLY_CAPACITY_MIN } from "@/lib/weekly-capacity";
import { ApiError } from "@/services/api-error";
import { getMockCurrentUser } from "@/services/auth-service";
import { DEFAULT_WEEKLY_CAPACITY, mockUserRecords } from "@/services/mock/users";
import { mockError, mockResponse } from "@/services/mock-response";
import { listMockProjects } from "@/services/projects-service";
import type {
  InviteMemberInput,
  SetMemberStatusInput,
  TeamMember,
  TeamMemberListParams,
  UpdateMemberInput,
} from "@/types/team";
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

/** True when the user is the only active Admin, so they must stay an active Admin. */
function isLastActiveAdmin(user: User): boolean {
  if (user.role !== "ADMIN" || user.status !== "ACTIVE") return false;
  return !users.some(
    (other) => other.id !== user.id && other.role === "ADMIN" && other.status === "ACTIVE",
  );
}

/** Applies a change to a stored user and returns it as a team member. */
function saveUser(updated: User): Promise<TeamMember> {
  users = users.map((user) => (user.id === updated.id ? updated : user));
  return mockResponse(toTeamMember(updated));
}

/**
 * Updates a member's role, job title and capacity (PATCH /team/members/:id).
 * Like the API: 404 for an unknown user; 400 for a capacity out of range, a change of your
 * own role, or demoting the last active Admin.
 */
export function updateMember({
  userId,
  role,
  jobTitle,
  weeklyCapacity,
}: UpdateMemberInput): Promise<TeamMember> {
  const user = users.find((item) => item.id === userId);
  if (!user) {
    return mockError(new ApiError(404, `Member ${userId} not found`));
  }
  if (
    !Number.isFinite(weeklyCapacity) ||
    weeklyCapacity < WEEKLY_CAPACITY_MIN ||
    weeklyCapacity > WEEKLY_CAPACITY_MAX
  ) {
    return mockError(
      new ApiError(
        400,
        `Weekly capacity must be between ${WEEKLY_CAPACITY_MIN} and ${WEEKLY_CAPACITY_MAX} hours.`,
      ),
    );
  }
  if (role !== user.role) {
    if (user.id === getMockCurrentUser().id) {
      return mockError(new ApiError(400, "You can't change your own role."));
    }
    if (isLastActiveAdmin(user)) {
      return mockError(new ApiError(400, "There must be at least one active Admin."));
    }
  }

  return saveUser({ ...user, role, jobTitle: jobTitle.trim(), weeklyCapacity });
}

/**
 * Deactivates or reactivates an account (PATCH /team/members/:id/status).
 * Like the API: 404 for an unknown user; 400 for an invited user (the invitation is handled
 * separately), deactivating your own account, or deactivating the last active Admin.
 */
export function setMemberStatus({ userId, status }: SetMemberStatusInput): Promise<TeamMember> {
  const user = users.find((item) => item.id === userId);
  if (!user) {
    return mockError(new ApiError(404, `Member ${userId} not found`));
  }
  if (user.status === "INVITED") {
    return mockError(
      new ApiError(400, "Invited members can't be deactivated or reactivated until they join."),
    );
  }
  if (status === "DEACTIVATED") {
    if (user.id === getMockCurrentUser().id) {
      return mockError(new ApiError(400, "You can't deactivate your own account."));
    }
    if (isLastActiveAdmin(user)) {
      return mockError(new ApiError(400, "There must be at least one active Admin."));
    }
  }

  return saveUser({ ...user, status });
}

/** For other mock services that need the current users (e.g. resources). */
export function listMockUsers(): User[] {
  return users;
}
