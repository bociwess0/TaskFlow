"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { useInviteMember } from "@/features/team/hooks/use-invite-member";
import {
  INVITE_MEMBER_DEFAULTS,
  type InviteMemberFormValues,
  inviteMemberSchema,
} from "@/features/team/schemas";
import { isConflictError } from "@/services/api-error";
import { ROLE_LABEL, ROLES } from "@/lib/user-role";

const CONTROL_CLASS = "h-10 bg-card";

/** Invite Member button with its dialog. The form mounts on open, so it always starts empty. */
export function InviteMemberDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="h-10 px-4">
          <Plus data-icon="inline-start" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[90svh] overflow-y-auto sm:max-w-lg"
        // The form focuses Full name itself.
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Invite member</DialogTitle>
          <DialogDescription>
            We&apos;ll send an invitation email with a link to join the workspace.
          </DialogDescription>
        </DialogHeader>
        {open && <InviteMemberForm onInvited={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function InviteMemberForm({ onInvited }: { onInvited: () => void }) {
  const id = useId();
  const inviteMember = useInviteMember();
  const { register, control, handleSubmit, setFocus, setError, formState } =
    useForm<InviteMemberFormValues>({
      resolver: zodResolver(inviteMemberSchema),
      defaultValues: INVITE_MEMBER_DEFAULTS,
    });
  const { errors } = formState;

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onSubmit = (values: InviteMemberFormValues) =>
    inviteMember.mutate(values, {
      onSuccess: onInvited,
      // A duplicate e-mail is shown under Email (the hook skips the toast for it);
      // the dialog stays open with the entered values.
      onError: (error) => {
        if (isConflictError(error)) {
          setError("email", { message: error.message }, { shouldFocus: true });
        }
      },
    });

  const fieldId = (name: keyof InviteMemberFormValues) => `${id}-${name}`;
  const errorId = (name: keyof InviteMemberFormValues) => `${id}-${name}-error`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <FieldGroup className="gap-5">
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor={fieldId("name")}>Full name</FieldLabel>
          <Input
            id={fieldId("name")}
            autoComplete="off"
            className={CONTROL_CLASS}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? errorId("name") : undefined}
            {...register("name")}
          />
          <FieldError id={errorId("name")} errors={[errors.name]} />
        </Field>

        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor={fieldId("email")}>Email</FieldLabel>
          <Input
            id={fieldId("email")}
            type="email"
            autoComplete="off"
            className={CONTROL_CLASS}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? errorId("email") : undefined}
            {...register("email")}
          />
          <FieldError id={errorId("email")} errors={[errors.email]} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor={fieldId("role")}>Role</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id={fieldId("role")}
                    className="w-full bg-card px-3 data-[size=default]:h-10"
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
              </Field>
            )}
          />

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
        </div>
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" size="lg" className="h-10 px-4">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" size="lg" className="h-10 px-4" disabled={inviteMember.isPending}>
          {inviteMember.isPending ? "Sending..." : "Send invitation"}
        </Button>
      </DialogFooter>
    </form>
  );
}
