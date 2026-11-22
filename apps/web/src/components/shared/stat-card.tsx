import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { StatusTone } from "@/types/status";

/** Icon colors; the tones are the same as status badge tones. */
const TONE_CLASS: Record<StatusTone, string> = {
  info: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/10 text-danger",
  highlight: "bg-highlight/10 text-highlight",
  neutral: "bg-muted text-muted-foreground",
};

export interface StatCardTrend {
  /** Signed change compared to the previous period. */
  change: number;
  unit: "count" | "percent";
  /** Period description, e.g. "this month", "from last week". */
  label?: string;
  /** Whether an increase is good news (green) or bad news (red). Defaults to true. */
  increaseIsPositive?: boolean;
}

interface StatCardProps {
  label: string;
  /** Already formatted value, e.g. 12, "78%", "32h". */
  value: string | number;
  icon: LucideIcon;
  /** Color of the icon. */
  tone: StatusTone;
  trend?: StatCardTrend;
  /** Short note below the value. */
  description?: string;
}

export function StatCard({ label, value, icon: Icon, tone, trend, description }: StatCardProps) {
  return (
    <Card className="flex-row items-start gap-4 px-5 py-5">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg",
          TONE_CLASS[tone],
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {trend && <StatTrend trend={trend} />}
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </Card>
  );
}

function StatTrend({ trend }: { trend: StatCardTrend }) {
  const { change, unit, label, increaseIsPositive = true } = trend;
  const isIncrease = change >= 0;
  const isPositive = isIncrease === increaseIsPositive;
  const TrendIcon = isIncrease ? ArrowUp : ArrowDown;
  const changeText = `${Math.abs(change)}${unit === "percent" ? "%" : ""}`;

  return (
    <p
      className={cn(
        "flex items-center gap-1 text-xs font-medium",
        isPositive ? "text-success" : "text-danger",
      )}
    >
      <TrendIcon className="size-3.5" aria-hidden />
      <span className="sr-only">{isIncrease ? "Up" : "Down"}</span>
      {changeText}
      {label && ` ${label}`}
    </p>
  );
}

/** Placeholder with the same size as a StatCard, shown while data loads. */
export function StatCardSkeleton() {
  return (
    <Card className="flex-row gap-4 px-5 py-5">
      <Skeleton className="size-10 rounded-lg" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </Card>
  );
}
