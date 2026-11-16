"use client";

import { Flag, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { ErrorState } from "@/components/shared/error-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useTaskComments } from "@/features/tasks/hooks/use-task-comments";
import { daysUntil, formatDate, formatRelativeTime } from "@/lib/format";
import { getTaskLabelTone } from "@/lib/task-labels";
import { TASK_PRIORITY_LABEL, TASK_PRIORITY_TEXT_CLASS } from "@/lib/task-priority";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

interface TaskDetailsSheetProps {
  /** Task id from the URL (?task=), or null when the panel is closed. */
  openTaskId: string | null;
  /** All tasks of the board (unfiltered); undefined while they load. */
  tasks: Task[] | undefined;
  onClose: () => void;
}

/** Read-only task details in a side panel (full width on phones). */
export function TaskDetailsSheet({ openTaskId, tasks, onClose }: TaskDetailsSheetProps) {
  const task = openTaskId ? tasks?.find((item) => item.id === openTaskId) : undefined;

  return (
    <Sheet open={openTaskId !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        aria-describedby={undefined}
        className="gap-0 overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-lg"
      >
        {!tasks ? (
          <TaskDetailsSkeleton />
        ) : task ? (
          <TaskDetails task={task} />
        ) : (
          <SheetHeader className="gap-2 p-6">
            <SheetTitle className="text-lg font-semibold">Task not found</SheetTitle>
            <p className="text-muted-foreground">
              This task doesn&apos;t exist in this project or was removed.
            </p>
          </SheetHeader>
        )}
      </SheetContent>
    </Sheet>
  );
}

function TaskDetails({ task }: { task: Task }) {
  const isOverdue = task.dueDate !== null && task.status !== "DONE" && daysUntil(task.dueDate) < 0;

  return (
    <>
      <SheetHeader className="gap-3 p-6 pr-12">
        <StatusBadge status={task.status} />
        <SheetTitle className="text-xl leading-snug font-semibold">{task.title}</SheetTitle>
      </SheetHeader>

      <div className="flex flex-col gap-6 px-6 pb-6">
        <dl className="grid grid-cols-[8rem_1fr] items-center gap-x-4 gap-y-3 text-sm">
          <DetailRow label="Priority">
            <span className="flex items-center gap-2">
              <Flag
                className={cn("size-4 fill-current", TASK_PRIORITY_TEXT_CLASS[task.priority])}
                aria-hidden
              />
              {TASK_PRIORITY_LABEL[task.priority]}
            </span>
          </DetailRow>
          <DetailRow label="Assignee">
            {task.assignee ? (
              <span className="flex items-center gap-2">
                <UserAvatar user={task.assignee} size="sm" />
                {task.assignee.name}
              </span>
            ) : (
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="flex size-6 items-center justify-center rounded-full border border-dashed border-muted-foreground/50">
                  <UserRound className="size-3.5" aria-hidden />
                </span>
                Unassigned
              </span>
            )}
          </DetailRow>
          <DetailRow label="Due date">
            {task.dueDate ? (
              <time dateTime={task.dueDate} className={cn(isOverdue && "font-medium text-danger")}>
                {formatDate(task.dueDate)}
                {isOverdue && " (overdue)"}
              </time>
            ) : (
              <span className="text-muted-foreground">No due date</span>
            )}
          </DetailRow>
          <DetailRow label="Estimate">
            {task.estimatedHours !== null ? (
              `${task.estimatedHours} h`
            ) : (
              <span className="text-muted-foreground">Not estimated</span>
            )}
          </DetailRow>
          <DetailRow label="Labels">
            {task.labels.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {task.labels.map((label) => (
                  <li key={label}>
                    <Badge variant={getTaskLabelTone(label)} className="rounded-md">
                      {label}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-muted-foreground">No labels</span>
            )}
          </DetailRow>
        </dl>

        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Description</h3>
          {task.description ? (
            <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
              {task.description}
            </p>
          ) : (
            <p className="text-muted-foreground italic">No description.</p>
          )}
        </section>

        <Separator />

        {/* Mounted only while the panel shows a task, so comments load when it opens. */}
        <TaskComments taskId={task.id} />
      </div>
    </>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </>
  );
}

function TaskComments({ taskId }: { taskId: string }) {
  const { data: comments, isPending, isError, refetch } = useTaskComments(taskId);

  return (
    <section className="flex flex-col gap-4" aria-labelledby="task-comments-title">
      <h3 id="task-comments-title" className="text-sm font-semibold">
        Comments
        {comments && comments.length > 0 && (
          <span className="ml-1.5 font-normal text-muted-foreground">{comments.length}</span>
        )}
      </h3>

      {isPending ? (
        <ul className="flex flex-col gap-4" aria-busy="true" aria-label="Loading comments">
          {Array.from({ length: 2 }, (_, index) => (
            <li key={index} className="flex gap-3">
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-full" />
              </div>
            </li>
          ))}
        </ul>
      ) : isError ? (
        <ErrorState message="Could not load comments." onRetry={() => refetch()} />
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No comments yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-3">
              <UserAvatar user={comment.author} />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
                  <span className="font-medium">{comment.author.name}</span>
                  <time dateTime={comment.createdAt} className="text-xs text-muted-foreground">
                    {formatRelativeTime(comment.createdAt)}
                  </time>
                </p>
                <p className="mt-1 text-sm leading-relaxed whitespace-pre-line">
                  {comment.content}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function TaskDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6" aria-busy="true" aria-label="Loading task">
      <SheetTitle className="sr-only">Loading task</SheetTitle>
      <Skeleton className="h-6 w-24 rounded-md" />
      <Skeleton className="h-7 w-3/4" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-5 w-full" />
        ))}
      </div>
      <Skeleton className="h-20 w-full" />
    </div>
  );
}
