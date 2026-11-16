"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface ProjectTab {
  label: string;
  /** Path below /projects/[projectId]; empty for Overview. */
  segment: string;
  /** Tabs without a page yet are shown but disabled. */
  enabled: boolean;
}

const PROJECT_TABS: ProjectTab[] = [
  { label: "Overview", segment: "", enabled: true },
  { label: "Board", segment: "board", enabled: true },
  { label: "List", segment: "list", enabled: false },
  { label: "Timeline", segment: "timeline", enabled: false },
  { label: "Team", segment: "team", enabled: false },
  { label: "Files", segment: "files", enabled: false },
  { label: "Settings", segment: "settings", enabled: false },
];

const TAB_CLASS =
  "-mb-px flex h-11 shrink-0 items-center border-b-2 px-3 text-sm font-medium whitespace-nowrap transition-colors";

interface ProjectTabsProps {
  projectId: string;
}

/** Navigation between project pages; the active tab follows the URL. */
export function ProjectTabs({ projectId }: ProjectTabsProps) {
  const pathname = usePathname();
  const basePath = `/projects/${projectId}`;

  return (
    <nav aria-label="Project sections" className="overflow-x-auto border-b">
      <ul className="flex gap-2">
        {PROJECT_TABS.map((tab) => {
          const href = tab.segment ? `${basePath}/${tab.segment}` : basePath;
          const isActive = tab.segment
            ? pathname === href || pathname.startsWith(`${href}/`)
            : pathname === basePath;

          return (
            <li key={tab.label}>
              {tab.enabled ? (
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    TAB_CLASS,
                    "rounded-t-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  {tab.label}
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className={cn(
                    TAB_CLASS,
                    "cursor-not-allowed border-transparent text-muted-foreground/60",
                  )}
                >
                  {tab.label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
