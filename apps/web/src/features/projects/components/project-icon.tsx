import {
  Briefcase,
  Contact,
  Globe,
  type LucideIcon,
  ShoppingCart,
  Smartphone,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectColor, ProjectIcon as ProjectIconKey } from "@/types/project";

const ICONS: Record<ProjectIconKey, LucideIcon> = {
  "shopping-cart": ShoppingCart,
  smartphone: Smartphone,
  wrench: Wrench,
  globe: Globe,
  contact: Contact,
  briefcase: Briefcase,
};

const COLOR_CLASS: Record<ProjectColor, string> = {
  primary: "bg-primary/10 text-primary-strong",
  success: "bg-success/10 text-success-strong",
  warning: "bg-warning/15 text-warning-strong",
  danger: "bg-danger/10 text-danger-strong",
  highlight: "bg-highlight/10 text-highlight-strong",
  neutral: "bg-muted text-muted-foreground",
};

const SIZE_CLASS = {
  default: "size-9 rounded-lg [&>svg]:size-5",
  lg: "size-14 rounded-xl [&>svg]:size-7",
} as const;

interface ProjectIconProps {
  icon: ProjectIconKey;
  color: ProjectColor;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
}

/** Project icon in a tinted rounded square, in the project's theme color. */
export function ProjectIcon({ icon, color, size = "default", className }: ProjectIconProps) {
  const Icon = ICONS[icon];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center",
        SIZE_CLASS[size],
        COLOR_CLASS[color],
        className,
      )}
    >
      <Icon aria-hidden />
    </div>
  );
}
