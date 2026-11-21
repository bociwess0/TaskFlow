import type { StatusTone } from "@/types/status";

/** Tag color of each known task label; each tone is a soft Badge variant. */
const TASK_LABEL_TONE: Record<string, StatusTone> = {
  design: "highlight",
  development: "info",
  backend: "success",
  testing: "danger",
  marketing: "warning",
};

/** Labels are free text, so unknown labels get a neutral tag. */
export function getTaskLabelTone(label: string): StatusTone {
  return TASK_LABEL_TONE[label.toLowerCase()] ?? "neutral";
}
