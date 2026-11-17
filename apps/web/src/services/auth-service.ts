import { mockUserRecords } from "@/services/mock/users";
import { mockResponse } from "@/services/mock-response";
import type { User } from "@/types/user";

const currentUser: User = mockUserRecords.bogdan;

/** For other mock services that act as the signed-in user (e.g. comment author). */
export function getMockCurrentUser(): User {
  return currentUser;
}

export function getCurrentUser(): Promise<User> {
  return mockResponse(currentUser);
}
