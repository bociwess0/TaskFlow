"use client";

import { CircleCheck, CircleDashed, CircleDot, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { daysUntil, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Milestone, MilestoneStatus } from "@/types/project";

const COLLAPSED_COUNT = 4;

const STATUS_ICON: Record<MilestoneStatus, { icon: LucideIcon; className: string }> = {
  COMPLETED: { icon: CircleCheck, className: "text-success" },
  IN_PROGRESS: { icon: CircleDot, className: "text-primary" },
  PENDING: { icon: CircleDashed, className: "text-muted-foreground" },
};

interface MilestonesCardProps {
  milestones: Milestone[];
}

/** Project milestones by due date (Overview tab); long lists expand in place. */
export function MilestonesCard({ milestones }: MilestonesCardProps) {
  const [expanded, setExpanded] = useState(false);

  const sorted = milestones.toSorted((a, b) => a.dueDate.localeCompare(b.dueDate));
  const canExpand = sorted.length > COLLAPSED_COUNT;
  const visible = expanded ? sorted : sorted.slice(0, COLLAPSED_COUNT);

  return (
    <Card className="gap-4 [--card-spacing:--spacing(5)]">
      <CardHeader>
        <CardTitle className="font-semibold">Milestones</CardTitle>
        {canExpand && (
          <CardAction>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? "Show less" : "View all"}
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <EmptyState message="No milestones yet." />
        ) : (
          <ul className="flex flex-col divide-y">
            {visible.map((milestone) => (
              <MilestoneRow key={milestone.id} milestone={milestone} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function MilestoneRow({ milestone }: { milestone: Milestone }) {
  const { icon: Icon, className: iconClassName } = STATUS_ICON[milestone.status];
  const isOverdue = milestone.status !== "COMPLETED" && daysUntil(milestone.dueDate) < 0;

  return (
    <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <Icon className={cn("size-5 shrink-0", iconClassName)} aria-hidden />
      <span className="min-w-0 flex-1 truncate font-medium">{milestone.name}</span>
      <StatusBadge status={milestone.status} />
      <time
        dateTime={milestone.dueDate}
        className={cn(
          "w-24 shrink-0 text-right text-sm tabular-nums",
          isOverdue ? "font-medium text-danger" : "text-muted-foreground",
        )}
      >
        {isOverdue && <span className="sr-only">Overdue: </span>}
        {formatDate(milestone.dueDate)}
      </time>
    </li>
  );
}
