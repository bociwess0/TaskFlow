import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  message: string;
  /** Optional call to action shown below the message. */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ message, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-8 text-center text-sm text-muted-foreground",
        className,
      )}
    >
      <Inbox className="size-6" aria-hidden />
      <p>{message}</p>
      {action}
    </div>
  );
}
