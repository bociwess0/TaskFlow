import { z } from "zod";
import type { CreateAllocationInput } from "@/types/resource";

export const ALLOCATION_PERCENT_MIN = 1;
export const ALLOCATION_PERCENT_MAX = 100;

/**
 * Validation for the allocation form. Values are kept as the inputs give them (percent is a
 * string); toAllocationInput turns them into the API shape. Overallocation is not an error
 * here: the dialog shows it as a warning from the allocation check.
 */
export const allocationSchema = z
  .object({
    userId: z.string().min(1, "Choose a member."),
    projectId: z.string().min(1, "Choose a project."),
    percent: z
      .string()
      .trim()
      .min(1, "Allocation is required.")
      .refine((value) => {
        const percent = Number(value);
        return (
          Number.isInteger(percent) &&
          percent >= ALLOCATION_PERCENT_MIN &&
          percent <= ALLOCATION_PERCENT_MAX
        );
      }, `Allocation must be a whole number from ${ALLOCATION_PERCENT_MIN} to ${ALLOCATION_PERCENT_MAX}.`),
    startDate: z.iso.date("Enter a valid start date."),
    endDate: z.iso.date("Enter a valid end date."),
  })
  // ISO dates compare correctly as strings.
  .refine((values) => values.endDate >= values.startDate, {
    message: "End date can't be before the start date.",
    path: ["endDate"],
  });

export type AllocationFormValues = z.infer<typeof allocationSchema>;

export function toAllocationInput(values: AllocationFormValues): CreateAllocationInput {
  return {
    userId: values.userId,
    projectId: values.projectId,
    percent: Number(values.percent),
    startDate: values.startDate,
    endDate: values.endDate,
  };
}

/**
 * The API input when the form values are complete and valid, otherwise null.
 * For the live overallocation check while the user fills in the form.
 */
export function parseAllocationInput(values: AllocationFormValues): CreateAllocationInput | null {
  const result = allocationSchema.safeParse(values);
  return result.success ? toAllocationInput(result.data) : null;
}
