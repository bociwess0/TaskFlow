"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { NOTIFICATIONS_HREF } from "@/components/layout/nav-items";
import { Button } from "@/components/ui/button";
import { useUnreadNotificationCount } from "@/hooks/use-unread-notification-count";

export function NotificationsButton() {
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const label =
    unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications";

  return (
    <Button variant="outline" size="icon-lg" className="relative rounded-full" asChild>
      <Link href={NOTIFICATIONS_HREF} aria-label={label}>
        <Bell />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-danger-foreground">
            {unreadCount}
          </span>
        )}
      </Link>
    </Button>
  );
}
