import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PROJECT_STATUS_LABEL, PROJECT_STATUS_TONE } from "@/lib/project-status";
import type { ProjectStatus } from "@/types/project";
import type { StatusTone } from "@/types/status";

/** Every status that has a badge. Add new status groups here (e.g. utilization). */
export type Status = ProjectStatus;

const STATUS_LABEL: Record<Status, string> = { ...PROJECT_STATUS_LABEL };
const STATUS_TONE: Record<Status, StatusTone> = { ...PROJECT_STATUS_TONE };

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant={STATUS_TONE[status]}
      className={cn("h-6 rounded-md px-2.5 text-xs", className)}
    >
      {STATUS_LABEL[status]}
    </Badge>
  );
}
