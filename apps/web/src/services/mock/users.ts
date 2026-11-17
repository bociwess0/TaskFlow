import type { User, UserSummary } from "@/types/user";

const DEFAULT_WEEKLY_CAPACITY = 40;

/** Mock users shared by all mock services, so the same person has the same id everywhere. */
export const mockUserRecords = {
  bogdan: {
    id: "u-1",
    name: "Bogdan Djordjevic",
    email: "bogdan@company.com",
    jobTitle: "Software Engineer",
    role: "ADMIN",
    status: "ACTIVE",
    weeklyCapacity: DEFAULT_WEEKLY_CAPACITY,
  },
  ana: {
    id: "u-2",
    name: "Ana Markovic",
    email: "ana@company.com",
    jobTitle: "Frontend Developer",
    role: "TEAM_MEMBER",
    status: "ACTIVE",
    weeklyCapacity: DEFAULT_WEEKLY_CAPACITY,
  },
  marko: {
    id: "u-3",
    name: "Marko Petrovic",
    email: "marko@company.com",
    jobTitle: "Backend Developer",
    role: "TEAM_MEMBER",
    status: "ACTIVE",
    weeklyCapacity: DEFAULT_WEEKLY_CAPACITY,
  },
  jelena: {
    id: "u-4",
    name: "Jelena Ilic",
    email: "jelena@company.com",
    jobTitle: "UI/UX Designer",
    role: "TEAM_MEMBER",
    status: "ACTIVE",
    weeklyCapacity: DEFAULT_WEEKLY_CAPACITY,
  },
  nikola: {
    id: "u-5",
    name: "Nikola Radovic",
    email: "nikola@company.com",
    jobTitle: "DevOps Engineer",
    role: "TEAM_MEMBER",
    status: "ACTIVE",
    weeklyCapacity: DEFAULT_WEEKLY_CAPACITY,
  },
  sara: {
    id: "u-6",
    name: "Sara Jovanovic",
    email: "sara@company.com",
    jobTitle: "QA Engineer",
    role: "TEAM_MEMBER",
    status: "ACTIVE",
    weeklyCapacity: DEFAULT_WEEKLY_CAPACITY,
  },
  ivan: {
    id: "u-7",
    name: "Ivan Stojanovic",
    email: "ivan@company.com",
    jobTitle: "Project Manager",
    role: "PROJECT_MANAGER",
    status: "ACTIVE",
    weeklyCapacity: DEFAULT_WEEKLY_CAPACITY,
  },
  // Invited but hasn't accepted yet, so not on any project.
  milan: {
    id: "u-8",
    name: "Milan Pavlovic",
    email: "milan@company.com",
    jobTitle: "Frontend Developer",
    role: "TEAM_MEMBER",
    status: "INVITED",
    weeklyCapacity: DEFAULT_WEEKLY_CAPACITY,
  },
} satisfies Record<string, User>;

type MockUserKey = keyof typeof mockUserRecords;

function toUserSummary({ id, name, avatarUrl }: User): UserSummary {
  return { id, name, avatarUrl };
}

/** The same users as summaries, for embedding in other entities (members, assignees...). */
export const mockUsers = Object.fromEntries(
  Object.entries(mockUserRecords).map(([key, user]) => [key, toUserSummary(user)]),
) as Record<MockUserKey, UserSummary>;
