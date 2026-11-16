import { CalendarDays, CircleCheck, Flag, UserRound } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { daysUntil, formatShortIsoDate } from "@/lib/format";
import { getTaskLabelTone } from "@/lib/task-labels";
import { TASK_PRIORITY_LABEL, TASK_PRIORITY_TEXT_CLASS } from "@/lib/task-priority";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

/** Only high priorities get a flag, so the board stays calm. */
const FLAGGED_PRIORITIES = new Set<Task["priority"]>(["HIGH", "URGENT"]);

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="px-4 [--card-spacing:--spacing(4)]">
      <div className="flex flex-col gap-3">
        <h3 className="text-sm leading-snug font-semibold">{task.title}</h3>

        {task.labels.length > 0 && (
          <ul aria-label="Labels" className="flex flex-wrap gap-1.5">
            {task.labels.map((label) => (
              <li key={label}>
                <Badge variant={getTaskLabelTone(label)} className="rounded-md">
                  {label}
                </Badge>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between gap-2">
          <TaskDue task={task} />
          <div className="flex items-center gap-2">
            {FLAGGED_PRIORITIES.has(task.priority) && (
              <Flag
                className={cn("size-4 fill-current", TASK_PRIORITY_TEXT_CLASS[task.priority])}
                role="img"
                aria-label={`${TASK_PRIORITY_LABEL[task.priority]} priority`}
              />
            )}
            <TaskAssignee assignee={task.assignee} />
          </div>
        </div>
      </div>
    </Card>
  );
}

function TaskDue({ task }: TaskCardProps) {
  if (task.status === "DONE") {
    return <CircleCheck className="size-4 text-success" role="img" aria-label="Completed" />;
  }

  if (!task.dueDate) {
    return <span />;
  }

  const isOverdue = daysUntil(task.dueDate) < 0;

  return (
    <p
      className={cn(
        "flex items-center gap-1.5 text-xs",
        isOverdue ? "font-medium text-danger" : "text-muted-foreground",
      )}
    >
      <CalendarDays className="size-3.5 shrink-0" aria-hidden />
      <span className="sr-only">{isOverdue ? "Overdue, due " : "Due "}</span>
      <time dateTime={task.dueDate}>{formatShortIsoDate(task.dueDate)}</time>
    </p>
  );
}

function TaskAssignee({ assignee }: Pick<Task, "assignee">) {
  if (!assignee) {
    return (
      <span
        role="img"
        aria-label="Unassigned"
        className="flex size-6 items-center justify-center rounded-full border border-dashed border-muted-foreground/50 text-muted-foreground"
      >
        <UserRound className="size-3.5" aria-hidden />
      </span>
    );
  }

  return (
    <span title={assignee.name} className="flex">
      <span className="sr-only">Assigned to {assignee.name}</span>
      <UserAvatar user={assignee} size="sm" />
    </span>
  );
}
