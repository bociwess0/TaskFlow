import { z } from "zod";
import { ROLES } from "@/lib/user-role";
import type { Role } from "@/types/user";

export const NAME_MIN = 2;
export const NAME_MAX = 80;
export const JOB_TITLE_MAX = 80;

export const inviteMemberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Full name is required.")
    .min(NAME_MIN, `Full name must be at least ${NAME_MIN} characters.`)
    .max(NAME_MAX, `Full name must be at most ${NAME_MAX} characters.`),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .pipe(z.email("Enter a valid email address.")),
  role: z.enum(ROLES as [Role, ...Role[]]),
  jobTitle: z
    .string()
    .trim()
    .max(JOB_TITLE_MAX, `Job title must be at most ${JOB_TITLE_MAX} characters.`),
});

export type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;

export const INVITE_MEMBER_DEFAULTS: InviteMemberFormValues = {
  name: "",
  email: "",
  role: "TEAM_MEMBER",
  jobTitle: "",
};
