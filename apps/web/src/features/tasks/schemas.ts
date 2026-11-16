import { z } from "zod";
import { TASK_PRIORITIES } from "@/lib/task-priority";
import { TASK_STATUSES } from "@/lib/task-status";
import type { Priority, Task, TaskInput, TaskStatus } from "@/types/task";

/** Assignee value for "Unassigned" in the form (selects can't hold null). */
export const UNASSIGNED = "unassigned";

export const TITLE_MIN = 3;
export const TITLE_MAX = 120;
export const DESCRIPTION_MAX = 2000;
export const ESTIMATE_MIN = 0.5;
export const ESTIMATE_MAX = 200;

interface TaskFormContext {
  /** Ids of project members, the only valid assignees. */
  memberIds: string[];
  /** Labels used on the board, the only labels to pick from. */
  labels: string[];
}

/**
 * Validation for the task form. Values are kept as the inputs give them (strings);
 * toTaskInput turns them into the API shape.
 */
export function createTaskFormSchema({ memberIds, labels }: TaskFormContext) {
  return z.object({
    title: z
      .string()
      .trim()
      .min(TITLE_MIN, `Title must be at least ${TITLE_MIN} characters.`)
      .max(TITLE_MAX, `Title must be at most ${TITLE_MAX} characters.`),
    description: z
      .string()
      .trim()
      .max(DESCRIPTION_MAX, `Description must be at most ${DESCRIPTION_MAX} characters.`),
    status: z.enum(TASK_STATUSES as [TaskStatus, ...TaskStatus[]]),
    priority: z.enum(TASK_PRIORITIES as [Priority, ...Priority[]]),
    assigneeId: z
      .string()
      .refine(
        (value) => value === UNASSIGNED || memberIds.includes(value),
        "Choose a project member or Unassigned.",
      ),
    dueDate: z.union([z.literal(""), z.iso.date("Enter a valid date.")]),
    estimatedHours: z.string().refine((value) => {
      if (value === "") return true;
      const hours = Number(value);
      return Number.isFinite(hours) && hours >= ESTIMATE_MIN && hours <= ESTIMATE_MAX;
    }, `Estimate must be between ${ESTIMATE_MIN} and ${ESTIMATE_MAX} hours.`),
    labels: z
      .array(z.string())
      .refine(
        (values) => values.every((label) => labels.includes(label)),
        "Choose labels from the board.",
      ),
  });
}

export type TaskFormValues = z.infer<ReturnType<typeof createTaskFormSchema>>;

export function getTaskFormDefaults(status: TaskStatus): TaskFormValues {
  return {
    title: "",
    description: "",
    status,
    priority: "MEDIUM",
    assigneeId: UNASSIGNED,
    dueDate: "",
    estimatedHours: "",
    labels: [],
  };
}

/** Form values for editing an existing task. */
export function getTaskFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assigneeId: task.assignee?.id ?? UNASSIGNED,
    dueDate: task.dueDate ?? "",
    estimatedHours: task.estimatedHours === null ? "" : String(task.estimatedHours),
    labels: task.labels,
  };
}

/** Form values (already validated) in the shape createTask and updateTask expect. */
export function toTaskInput(values: TaskFormValues): TaskInput {
  return {
    title: values.title,
    description: values.description,
    status: values.status,
    priority: values.priority,
    assigneeId: values.assigneeId === UNASSIGNED ? null : values.assigneeId,
    dueDate: values.dueDate || null,
    estimatedHours: values.estimatedHours === "" ? null : Number(values.estimatedHours),
    labels: values.labels,
  };
}
