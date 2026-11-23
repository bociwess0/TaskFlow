"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { AllocationPreview } from "@/features/resources/components/allocation-preview";
import { useCreateAllocation } from "@/features/resources/hooks/use-create-allocation";
import { useLiveAllocationCheck } from "@/features/resources/hooks/use-live-allocation-check";
import {
  ALLOCATION_DEFAULTS,
  ALLOCATION_PERCENT_MAX,
  ALLOCATION_PERCENT_MIN,
  type AllocationFormValues,
  allocationSchema,
  parseAllocationInput,
  toAllocationInput,
} from "@/features/resources/schemas";
import { useTeamMembers } from "@/features/team/hooks/use-team-members";
import { ALLOCATING_PROJECT_STATUSES, toIsoDate } from "@/lib/utilization";

const CONTROL_CLASS = "h-10 bg-card";
const SELECT_TRIGGER_CLASS = "w-full bg-card px-3 data-[size=default]:h-10";

/** Allocate Member button with its dialog. The form mounts on open, so it always starts empty. */
export function AllocationDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="h-10 px-4">
          <Plus data-icon="inline-start" />
          Allocate Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Allocate member</DialogTitle>
          <DialogDescription>
            Assign a member to a project. Their load in the period is checked before you save.
          </DialogDescription>
        </DialogHeader>
        {open && <AllocationForm onAllocated={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function AllocationForm({ onAllocated }: { onAllocated: () => void }) {
  const id = useId();
  const createAllocation = useCreateAllocation();
  const { data: teamMembers, isPending: membersPending } = useTeamMembers();
  const { data: allProjects, isPending: projectsPending } = useProjects();

  const { register, control, handleSubmit, getValues, setValue, reset, formState } =
    useForm<AllocationFormValues>({
      resolver: zodResolver(allocationSchema),
      defaultValues: ALLOCATION_DEFAULTS,
    });
  const { errors } = formState;

  const values = useWatch({ control });
  const input = parseAllocationInput(values);
  const { check, isCurrent } = useLiveAllocationCheck(input);

  const members = teamMembers?.filter((member) => member.status === "ACTIVE") ?? [];
  const allocatingProjects =
    allProjects?.filter((project) => ALLOCATING_PROJECT_STATUSES.includes(project.status)) ?? [];
  // A member can be on a project only once, so their projects are left out.
  const projects = allocatingProjects.filter(
    (project) => !project.members.some((member) => member.id === values.userId),
  );
  const selectedMember = members.find((member) => member.id === values.userId);
  const selectedProject = allocatingProjects.find((project) => project.id === values.projectId);

  const isOverallocated = isCurrent && check.data?.newStatus === "OVERALLOCATED";
  // Save only with the check for the current values, so the warning is never skipped.
  // An incomplete form can be submitted to show its errors.
  const canSave = !createAllocation.isPending && (input === null || isCurrent);

  const onMemberChange = (userId: string) => {
    setValue("userId", userId, { shouldValidate: formState.isSubmitted });
    const project = allocatingProjects.find((item) => item.id === getValues("projectId"));
    if (project?.members.some((member) => member.id === userId)) {
      setValue("projectId", "", { shouldValidate: formState.isSubmitted });
    }
  };

  const onProjectChange = (projectId: string) => {
    setValue("projectId", projectId, { shouldValidate: formState.isSubmitted });
    const project = allocatingProjects.find((item) => item.id === projectId);
    if (!project) return;
    // Fill empty dates with the rest of the project: from today (or its start) to its end.
    if (!getValues("startDate")) {
      const today = toIsoDate(new Date());
      setValue("startDate", today > project.startDate ? today : project.startDate);
    }
    if (!getValues("endDate")) {
      setValue("endDate", project.endDate);
    }
  };

  const onSubmit = (formValues: AllocationFormValues) =>
    createAllocation.mutate(toAllocationInput(formValues), {
      // On an error the dialog stays open with the entered values (the hook shows a toast).
      onSuccess: () => {
        reset(ALLOCATION_DEFAULTS);
        onAllocated();
      },
    });

  const fieldId = (name: keyof AllocationFormValues) => `${id}-${name}`;
  const errorId = (name: keyof AllocationFormValues) => `${id}-${name}-error`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <FieldGroup className="gap-5">
        <Controller
          control={control}
          name="userId"
          render={({ field }) => (
            <Field data-invalid={Boolean(errors.userId)}>
              <FieldLabel htmlFor={fieldId("userId")}>Member</FieldLabel>
              <Select value={field.value} onValueChange={onMemberChange} disabled={membersPending}>
                <SelectTrigger
                  id={fieldId("userId")}
                  className={SELECT_TRIGGER_CLASS}
                  aria-invalid={Boolean(errors.userId)}
                  aria-describedby={errors.userId ? errorId("userId") : undefined}
                >
                  <SelectValue placeholder={membersPending ? "Loading..." : "Choose a member"} />
                </SelectTrigger>
                <SelectContent position="popper">
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError id={errorId("userId")} errors={[errors.userId]} />
            </Field>
          )}
        />

        <Controller
          control={control}
          name="projectId"
          render={({ field }) => (
            <Field data-invalid={Boolean(errors.projectId)}>
              <FieldLabel htmlFor={fieldId("projectId")}>Project</FieldLabel>
              <Select
                value={field.value}
                onValueChange={onProjectChange}
                disabled={projectsPending}
              >
                <SelectTrigger
                  id={fieldId("projectId")}
                  className={SELECT_TRIGGER_CLASS}
                  aria-invalid={Boolean(errors.projectId)}
                  aria-describedby={errors.projectId ? errorId("projectId") : undefined}
                >
                  <SelectValue placeholder={projectsPending ? "Loading..." : "Choose a project"} />
                </SelectTrigger>
                <SelectContent position="popper">
                  {projects.length === 0 ? (
                    <p className="px-2 py-1.5 text-sm text-muted-foreground">
                      No active projects left for this member.
                    </p>
                  ) : (
                    projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FieldError id={errorId("projectId")} errors={[errors.projectId]} />
            </Field>
          )}
        />

        <Field data-invalid={Boolean(errors.percent)}>
          <FieldLabel htmlFor={fieldId("percent")}>Allocation (%)</FieldLabel>
          <Input
            id={fieldId("percent")}
            type="number"
            inputMode="numeric"
            min={ALLOCATION_PERCENT_MIN}
            max={ALLOCATION_PERCENT_MAX}
            step={1}
            placeholder="e.g. 50"
            className={CONTROL_CLASS}
            aria-invalid={Boolean(errors.percent)}
            aria-describedby={errors.percent ? errorId("percent") : undefined}
            {...register("percent")}
          />
          <FieldError id={errorId("percent")} errors={[errors.percent]} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.startDate)}>
            <FieldLabel htmlFor={fieldId("startDate")}>Start date</FieldLabel>
            <Input
              id={fieldId("startDate")}
              type="date"
              min={selectedProject?.startDate}
              max={selectedProject?.endDate}
              className={CONTROL_CLASS}
              aria-invalid={Boolean(errors.startDate)}
              aria-describedby={errors.startDate ? errorId("startDate") : undefined}
              {...register("startDate")}
            />
            <FieldError id={errorId("startDate")} errors={[errors.startDate]} />
          </Field>

          <Field data-invalid={Boolean(errors.endDate)}>
            <FieldLabel htmlFor={fieldId("endDate")}>End date</FieldLabel>
            <Input
              id={fieldId("endDate")}
              type="date"
              min={values.startDate || selectedProject?.startDate}
              max={selectedProject?.endDate}
              className={CONTROL_CLASS}
              aria-invalid={Boolean(errors.endDate)}
              aria-describedby={errors.endDate ? errorId("endDate") : undefined}
              {...register("endDate")}
            />
            <FieldError id={errorId("endDate")} errors={[errors.endDate]} />
          </Field>
        </div>
      </FieldGroup>

      <AllocationPreview
        isComplete={input !== null}
        check={check}
        isCurrent={isCurrent}
        memberName={selectedMember?.name ?? "The member"}
      />

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" size="lg" className="h-10 px-4">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" size="lg" className="h-10 px-4" disabled={!canSave}>
          {createAllocation.isPending
            ? "Saving..."
            : isOverallocated
              ? "Allocate anyway"
              : "Allocate"}
        </Button>
      </DialogFooter>
    </form>
  );
}
