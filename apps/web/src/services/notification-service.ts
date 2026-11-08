import { mockResponse } from "@/services/mock-response";

export function getUnreadNotificationCount(): Promise<number> {
  return mockResponse(3);
}
