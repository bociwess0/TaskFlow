import type { StatusTone } from "@/types/status";

/** Tag color of a task label; each tone is a soft Badge variant. */
export type TaskLabelTone = StatusTone | "highlight";

const TASK_LABEL_TONE: Record<string, TaskLabelTone> = {
  design: "highlight",
  development: "info",
  backend: "success",
  testing: "danger",
  marketing: "warning",
};

/** Labels are free text, so unknown labels get a neutral tag. */
export function getTaskLabelTone(label: string): TaskLabelTone {
  return TASK_LABEL_TONE[label.toLowerCase()] ?? "neutral";
}
