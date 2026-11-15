"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import type { NavItem } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

interface SidebarNavLinkProps {
  item: NavItem;
  badge?: number;
  onNavigate?: () => void;
}

export function SidebarNavLink(props: SidebarNavLinkProps) {
  // The pathname is request data on dynamic routes, so the active state renders
  // inside Suspense; until then the link shows as inactive.
  return (
    <Suspense fallback={<NavLink {...props} isActive={false} />}>
      <ActiveAwareNavLink {...props} />
    </Suspense>
  );
}

function ActiveAwareNavLink(props: SidebarNavLinkProps) {
  const pathname = usePathname();
  const { href } = props.item;
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return <NavLink {...props} isActive={isActive} />;
}

function NavLink({
  item,
  badge,
  onNavigate,
  isActive,
}: SidebarNavLinkProps & { isActive: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/50",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="size-4.5 shrink-0" aria-hidden />
      <span className="flex-1">{item.label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="flex size-5 items-center justify-center rounded-full bg-danger text-[11px] font-semibold text-danger-foreground">
          {badge}
        </span>
      )}
    </Link>
  );
}
