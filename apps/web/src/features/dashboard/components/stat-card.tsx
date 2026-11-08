import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardStat } from "@/types/dashboard";

export type StatTone = "success" | "highlight" | "primary";

const TONE_CLASS: Record<StatTone, string> = {
  success: "bg-success/10 text-success",
  highlight: "bg-highlight/10 text-highlight",
  primary: "bg-primary/10 text-primary",
};

interface StatCardProps {
  label: string;
  stat: DashboardStat;
  icon: LucideIcon;
  tone: StatTone;
  formatValue?: (value: number) => string;
  /** Whether an increase is good news (green) or bad news (red). */
  increaseIsPositive?: boolean;
}

export function StatCard({
  label,
  stat,
  icon: Icon,
  tone,
  formatValue = String,
  increaseIsPositive = true,
}: StatCardProps) {
  const { change, unit, label: trendLabel } = stat.trend;
  const isIncrease = change >= 0;
  const isPositive = isIncrease === increaseIsPositive;
  const TrendIcon = isIncrease ? ArrowUp : ArrowDown;
  const changeText = `${Math.abs(change)}${unit === "percent" ? "%" : ""}`;

  return (
    <Card className="flex-row items-start gap-4 px-5 py-5">
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", TONE_CLASS[tone])}>
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold tracking-tight">{formatValue(stat.value)}</p>
        <p
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            isPositive ? "text-success" : "text-danger",
          )}
        >
          <TrendIcon className="size-3.5" aria-hidden />
          <span className="sr-only">{isIncrease ? "Up" : "Down"}</span>
          {changeText}
          {trendLabel && ` ${trendLabel}`}
        </p>
      </div>
    </Card>
  );
}
