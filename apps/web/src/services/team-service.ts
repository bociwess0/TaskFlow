import { mockUserRecords } from "@/services/mock/users";
import { mockResponse } from "@/services/mock-response";
import { listMockProjects } from "@/services/projects-service";
import type { TeamMember, TeamMemberListParams } from "@/types/team";
import type { User } from "@/types/user";

const users: User[] = Object.values(mockUserRecords);

/** Counts on the "server" like the API will: archived projects don't count. */
function countProjects(userId: string): number {
  return listMockProjects().filter(
    (project) =>
      project.status !== "ARCHIVED" && project.members.some((member) => member.id === userId),
  ).length;
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
    .map((user) => ({ ...user, projectCount: countProjects(user.id) }));

  return mockResponse(result);
}
