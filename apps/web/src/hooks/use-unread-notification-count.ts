"use client";

import { useQuery } from "@tanstack/react-query";
import { getUnreadNotificationCount } from "@/services/notification-service";

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadNotificationCount,
  });
}
