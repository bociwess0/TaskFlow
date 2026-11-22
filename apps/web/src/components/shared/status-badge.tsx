import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MILESTONE_STATUS_LABEL, MILESTONE_STATUS_TONE } from "@/lib/milestone-status";
import { PROJECT_STATUS_LABEL, PROJECT_STATUS_TONE } from "@/lib/project-status";
import { TASK_STATUS_LABEL, TASK_STATUS_TONE } from "@/lib/task-status";
import { USER_STATUS_LABEL, USER_STATUS_TONE } from "@/lib/user-status";
import { UTILIZATION_STATUS_LABEL, UTILIZATION_STATUS_TONE } from "@/lib/utilization-status";
import type { MilestoneStatus, ProjectStatus } from "@/types/project";
import type { UtilizationStatus } from "@/types/resource";
import type { StatusTone } from "@/types/status";
import type { TaskStatus } from "@/types/task";
import type { UserStatus } from "@/types/user";

/**
 * Every status that has a badge. Add new status groups here.
 * Groups that share a status (COMPLETED, IN_PROGRESS, ACTIVE) use the same label and tone.
 */
export type Status = ProjectStatus | MilestoneStatus | TaskStatus | UserStatus | UtilizationStatus;

const STATUS_LABEL: Record<Status, string> = {
  ...PROJECT_STATUS_LABEL,
  ...MILESTONE_STATUS_LABEL,
  ...TASK_STATUS_LABEL,
  ...USER_STATUS_LABEL,
  ...UTILIZATION_STATUS_LABEL,
};
const STATUS_TONE: Record<Status, StatusTone> = {
  ...PROJECT_STATUS_TONE,
  ...MILESTONE_STATUS_TONE,
  ...TASK_STATUS_TONE,
  ...USER_STATUS_TONE,
  ...UTILIZATION_STATUS_TONE,
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={STATUS_TONE[status]} className={cn("h-6 rounded-md px-2.5 text-xs", className)}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
