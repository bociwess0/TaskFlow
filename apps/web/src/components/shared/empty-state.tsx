import { Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  message: string;
  /** Defaults to an inbox icon. */
  icon?: LucideIcon;
  /** Optional call to action shown below the message. */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ message, icon: Icon = Inbox, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-8 text-center text-sm text-muted-foreground",
        className,
      )}
    >
      <Icon className="size-6" aria-hidden />
      <p>{message}</p>
      {action}
    </div>
  );
}
