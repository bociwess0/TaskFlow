import { mockResponse } from "@/services/mock-response";
import type { User } from "@/types/user";

const currentUser: User = {
  id: "u-1",
  name: "Bogdan Djordjevic",
  email: "bogdan@company.com",
  jobTitle: "Software Engineer",
  role: "ADMIN",
};

export function getCurrentUser(): Promise<User> {
  return mockResponse(currentUser);
}
