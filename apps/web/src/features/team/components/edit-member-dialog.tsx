"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useSetMemberStatus } from "@/features/team/hooks/use-set-member-status";
import { useUpdateMember } from "@/features/team/hooks/use-update-member";
import { type EditMemberFormValues, editMemberSchema } from "@/features/team/schemas";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ROLE_LABEL, ROLES } from "@/lib/user-role";
import { WEEKLY_CAPACITY_MAX, WEEKLY_CAPACITY_MIN } from "@/lib/weekly-capacity";
import type { TeamMember } from "@/types/team";

const CONTROL_CLASS = "h-10 bg-card";
const BUTTON_CLASS = "h-10 px-4";

interface EditMemberDialogProps {
  /** Member being edited; null keeps the dialog closed. */
  member: TeamMember | null;
  onClose: () => void;
}

/** Dialog for changing a member's role, job title, capacity and account status. */
export function EditMemberDialog({ member, onClose }: EditMemberDialogProps) {
  const { data: currentUser } = useCurrentUser();
  // Until the signed-in user is known, treat the member as yourself so nothing is allowed
  // that the API would reject.
  const isSelf = !currentUser || currentUser.id === member?.id;

  return (
    <Dialog open={member !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit member</DialogTitle>
          <DialogDescription>
            Name and email are changed by the member in their own settings.
          </DialogDescription>
        </DialogHeader>
        {/* Keyed by member, so the form and the confirmation start fresh for each member. */}
        {member && (
          <div key={member.id} className="flex flex-col gap-6">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <UserAvatar user={member} size="lg" />
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium">{member.name}</span>
                <span className="truncate text-sm text-muted-foreground">{member.email}</span>
              </div>
            </div>
            <EditMemberForm member={member} isSelf={isSelf} onSaved={onClose} />
            <Separator />
            <AccountSection member={member} isSelf={isSelf} onChanged={onClose} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface EditMemberFormProps {
  member: TeamMember;
  isSelf: boolean;
  onSaved: () => void;
}

function EditMemberForm({ member, isSelf, onSaved }: EditMemberFormProps) {
  const id = useId();
  const updateMember = useUpdateMember();
  const { register, control, handleSubmit, formState } = useForm<EditMemberFormValues>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: {
      role: member.role,
      jobTitle: member.jobTitle,
      weeklyCapacity: String(member.weeklyCapacity),
    },
  });
  const { errors } = formState;

  // On error the dialog stays open with the entered values; the toast explains what failed.
  const onSubmit = (values: EditMemberFormValues) =>
    updateMember.mutate(
      {
        userId: member.id,
        role: values.role,
        jobTitle: values.jobTitle,
        weeklyCapacity: Number(values.weeklyCapacity),
      },
      { onSuccess: onSaved },
    );

  const fieldId = (name: keyof EditMemberFormValues) => `${id}-${name}`;
  const errorId = (name: keyof EditMemberFormValues) => `${id}-${name}-error`;
  const roleHintId = `${id}-role-hint`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <FieldGroup className="gap-5">
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Field data-disabled={isSelf}>
              <FieldLabel htmlFor={fieldId("role")}>Role</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={isSelf}>
                <SelectTrigger
                  id={fieldId("role")}
                  className="w-full bg-card px-3 data-[size=default]:h-10"
                  aria-describedby={isSelf ? roleHintId : undefined}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {ROLE_LABEL[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isSelf && (
                <FieldDescription id={roleHintId}>
                  You can&apos;t change your own role.
                </FieldDescription>
              )}
            </Field>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.jobTitle)}>
            <FieldLabel htmlFor={fieldId("jobTitle")}>
              Job title <span className="font-normal text-muted-foreground">(optional)</span>
            </FieldLabel>
            <Input
              id={fieldId("jobTitle")}
              placeholder="e.g. Frontend Developer"
              className={CONTROL_CLASS}
              aria-invalid={Boolean(errors.jobTitle)}
              aria-describedby={errors.jobTitle ? errorId("jobTitle") : undefined}
              {...register("jobTitle")}
            />
            <FieldError id={errorId("jobTitle")} errors={[errors.jobTitle]} />
          </Field>

          <Field data-invalid={Boolean(errors.weeklyCapacity)}>
            <FieldLabel htmlFor={fieldId("weeklyCapacity")}>Weekly capacity (h)</FieldLabel>
            <Input
              id={fieldId("weeklyCapacity")}
              type="number"
              inputMode="decimal"
              min={WEEKLY_CAPACITY_MIN}
              max={WEEKLY_CAPACITY_MAX}
              step="any"
              className={CONTROL_CLASS}
              aria-invalid={Boolean(errors.weeklyCapacity)}
              aria-describedby={errors.weeklyCapacity ? errorId("weeklyCapacity") : undefined}
              {...register("weeklyCapacity")}
            />
            <FieldError id={errorId("weeklyCapacity")} errors={[errors.weeklyCapacity]} />
          </Field>
        </div>
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" size="lg" className={BUTTON_CLASS}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" size="lg" className={BUTTON_CLASS} disabled={updateMember.isPending}>
          {updateMember.isPending ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}

interface AccountSectionProps {
  member: TeamMember;
  isSelf: boolean;
  onChanged: () => void;
}

/** Deactivate (with a second-click confirmation) or reactivate the member's account. */
function AccountSection({ member, isSelf, onChanged }: AccountSectionProps) {
  const setMemberStatus = useSetMemberStatus();
  const [confirming, setConfirming] = useState(false);
  const { isPending } = setMemberStatus;

  const changeStatus = (status: "ACTIVE" | "DEACTIVATED") =>
    setMemberStatus.mutate({ userId: member.id, status }, { onSuccess: onChanged });

  return (
    <section aria-labelledby={`account-${member.id}`} className="flex flex-col gap-3">
      <h3 id={`account-${member.id}`} className="text-sm font-medium">
        Account
      </h3>

      {member.status === "INVITED" && (
        <p className="text-sm text-muted-foreground">
          The invitation hasn&apos;t been accepted yet, so the account can&apos;t be deactivated.
        </p>
      )}

      {member.status === "DEACTIVATED" && (
        <>
          <p className="text-sm text-muted-foreground">
            This member can&apos;t sign in. Reactivate the account to restore access.
          </p>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className={`${BUTTON_CLASS} self-start`}
            disabled={isPending}
            onClick={() => changeStatus("ACTIVE")}
          >
            {isPending ? "Reactivating..." : "Reactivate account"}
          </Button>
        </>
      )}

      {member.status === "ACTIVE" && (
        <>
          <p className="text-sm text-muted-foreground">
            {isSelf
              ? "You can't deactivate your own account."
              : confirming
                ? `${member.name} will no longer be able to sign in. You can reactivate the account later.`
                : "A deactivated member can't sign in, but their work stays in the projects."}
          </p>
          {confirming ? (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className={BUTTON_CLASS}
                disabled={isPending}
                onClick={() => setConfirming(false)}
              >
                Keep active
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="lg"
                className={BUTTON_CLASS}
                disabled={isPending}
                onClick={() => changeStatus("DEACTIVATED")}
              >
                {isPending ? "Deactivating..." : "Confirm deactivation"}
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="destructive"
              size="lg"
              className={`${BUTTON_CLASS} self-start`}
              disabled={isSelf}
              onClick={() => setConfirming(true)}
            >
              Deactivate account
            </Button>
          )}
        </>
      )}
    </section>
  );
}
