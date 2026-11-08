import {
  Bell,
  Calendar,
  ChartColumn,
  Clock,
  FolderKanban,
  LayoutDashboard,
  Settings,
  SquareCheckBig,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Tasks", href: "/tasks", icon: SquareCheckBig },
  { label: "Timesheets", href: "/timesheets", icon: Clock },
  { label: "Resources", href: "/resources", icon: UsersRound },
  { label: "Team", href: "/team", icon: Users },
  { label: "Reports", href: "/reports", icon: ChartColumn },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Notifications", href: "/notifications", icon: Bell },
];

export const SETTINGS_NAV_ITEM: NavItem = {
  label: "Settings",
  href: "/settings",
  icon: Settings,
};

export const NOTIFICATIONS_HREF = "/notifications";
