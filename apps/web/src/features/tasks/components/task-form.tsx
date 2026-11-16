"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactNode, useEffect, useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createTaskFormSchema,
  ESTIMATE_MAX,
  ESTIMATE_MIN,
  type TaskFormValues,
  UNASSIGNED,
} from "@/features/tasks/schemas";
import { getTaskLabelTone } from "@/lib/task-labels";
import { TASK_PRIORITIES, TASK_PRIORITY_LABEL } from "@/lib/task-priority";
import { TASK_STATUS_LABEL, TASK_STATUSES } from "@/lib/task-status";
import { cn } from "@/lib/utils";
import type { UserSummary } from "@/types/user";

const CONTROL_CLASS = "h-10 bg-card";
const TRIGGER_CLASS = "w-full bg-card px-3 data-[size=default]:h-10";

/** Soft tag colors for the label toggles, matching the Badge variants on cards. */
const LABEL_TONE_CLASS = {
  info: "border-primary/30 bg-primary/10 text-primary-strong",
  success: "border-success/30 bg-success/10 text-success-strong",
  warning: "border-warning/40 bg-warning/15 text-warning-strong",
  danger: "border-danger/30 bg-danger/10 text-danger-strong",
  highlight: "border-highlight/30 bg-highlight/10 text-highlight-strong",
  neutral: "border-foreground/20 bg-muted text-foreground",
} as const;

interface TaskFormProps {
  defaultValues: TaskFormValues;
  /** Project members, the only valid assignees. */
  members: UserSummary[];
  /** Labels used on the board, the only labels to pick from. */
  labels: string[];
  /** Called with validated values. */
  onSubmit: (values: TaskFormValues) => void;
  /** Buttons under the fields; one of them should be type="submit". */
  actions: ReactNode;
}

/** Task fields with validation, shared by creating (dialog) and editing (details panel). */
export function TaskForm({ defaultValues, members, labels, onSubmit, actions }: TaskFormProps) {
  const id = useId();
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(
      createTaskFormSchema({ memberIds: members.map((member) => member.id), labels }),
    ),
    defaultValues,
  });
  const { register, control, handleSubmit, setFocus, formState } = form;
  const { errors } = formState;

  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

  const fieldId = (name: keyof TaskFormValues) => `${id}-${name}`;
  const errorId = (name: keyof TaskFormValues) => `${id}-${name}-error`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <FieldGroup className="gap-5">
        <Field data-invalid={Boolean(errors.title)}>
          <FieldLabel htmlFor={fieldId("title")}>Title</FieldLabel>
          <Input
            id={fieldId("title")}
            className={CONTROL_CLASS}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? errorId("title") : undefined}
            {...register("title")}
          />
          <FieldError id={errorId("title")} errors={[errors.title]} />
        </Field>

        <Field data-invalid={Boolean(errors.description)}>
          <FieldLabel htmlFor={fieldId("description")}>
            Description <span className="font-normal text-muted-foreground">(optional)</span>
          </FieldLabel>
          <Textarea
            id={fieldId("description")}
            rows={4}
            className="bg-card"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? errorId("description") : undefined}
            {...register("description")}
          />
          <FieldError id={errorId("description")} errors={[errors.description]} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor={fieldId("status")}>Status</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={fieldId("status")} className={TRIGGER_CLASS}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {TASK_STATUSES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {TASK_STATUS_LABEL[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor={fieldId("priority")}>Priority</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={fieldId("priority")} className={TRIGGER_CLASS}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {TASK_PRIORITIES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {TASK_PRIORITY_LABEL[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <Controller
            control={control}
            name="assigneeId"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={fieldId("assigneeId")}>Assignee</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id={fieldId("assigneeId")}
                    className={TRIGGER_CLASS}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Field data-invalid={Boolean(errors.dueDate)}>
            <FieldLabel htmlFor={fieldId("dueDate")}>
              Due date <span className="font-normal text-muted-foreground">(optional)</span>
            </FieldLabel>
            <Input
              id={fieldId("dueDate")}
              type="date"
              className={CONTROL_CLASS}
              aria-invalid={Boolean(errors.dueDate)}
              aria-describedby={errors.dueDate ? errorId("dueDate") : undefined}
              {...register("dueDate")}
            />
            <FieldError id={errorId("dueDate")} errors={[errors.dueDate]} />
          </Field>

          <Field data-invalid={Boolean(errors.estimatedHours)}>
            <FieldLabel htmlFor={fieldId("estimatedHours")}>
              Estimate (hours) <span className="font-normal text-muted-foreground">(optional)</span>
            </FieldLabel>
            <Input
              id={fieldId("estimatedHours")}
              type="number"
              inputMode="decimal"
              step={0.5}
              min={ESTIMATE_MIN}
              max={ESTIMATE_MAX}
              className={CONTROL_CLASS}
              aria-invalid={Boolean(errors.estimatedHours)}
              aria-describedby={errors.estimatedHours ? errorId("estimatedHours") : undefined}
              {...register("estimatedHours")}
            />
            <FieldError id={errorId("estimatedHours")} errors={[errors.estimatedHours]} />
          </Field>
        </div>

        {labels.length > 0 && (
          <Controller
            control={control}
            name="labels"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldTitle id={fieldId("labels")}>
                  Labels <span className="font-normal text-muted-foreground">(optional)</span>
                </FieldTitle>
                <div
                  role="group"
                  aria-labelledby={fieldId("labels")}
                  className="flex flex-wrap gap-2"
                >
                  {labels.map((label) => {
                    const selected = field.value.includes(label);
                    return (
                      <button
                        key={label}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          field.onChange(
                            selected
                              ? field.value.filter((item) => item !== label)
                              : [...field.value, label],
                          )
                        }
                        className={cn(
                          "h-7 rounded-md border px-2.5 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                          selected
                            ? LABEL_TONE_CLASS[getTaskLabelTone(label)]
                            : "border-border bg-card text-muted-foreground hover:bg-muted",
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        )}
      </FieldGroup>

      {actions}
    </form>
  );
}
