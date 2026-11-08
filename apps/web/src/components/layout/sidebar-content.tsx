"use client";

import { Brand } from "@/components/layout/brand";
import {
  MAIN_NAV_ITEMS,
  NOTIFICATIONS_HREF,
  SETTINGS_NAV_ITEM,
} from "@/components/layout/nav-items";
import { SidebarNavLink } from "@/components/layout/sidebar-nav-link";
import { SidebarUser } from "@/components/layout/sidebar-user";
import { useUnreadNotificationCount } from "@/hooks/use-unread-notification-count";

interface SidebarContentProps {
  /** Called after a link is clicked (closes the mobile drawer). */
  onNavigate?: () => void;
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  const { data: unreadCount } = useUnreadNotificationCount();

  return (
    <div className="flex h-full flex-col gap-6 bg-sidebar px-3 py-5">
      <div className="px-3">
        <Brand />
      </div>

      <nav aria-label="Main" className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {MAIN_NAV_ITEMS.map((item) => (
          <SidebarNavLink
            key={item.href}
            item={item}
            badge={item.href === NOTIFICATIONS_HREF ? unreadCount : undefined}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="flex flex-col gap-3">
        <SidebarNavLink item={SETTINGS_NAV_ITEM} onNavigate={onNavigate} />
        <div className="border-t border-sidebar-border pt-3">
          <SidebarUser />
        </div>
      </div>
    </div>
  );
}
