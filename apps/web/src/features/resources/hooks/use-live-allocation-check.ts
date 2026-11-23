"use client";

import { useAllocationCheck } from "@/features/resources/hooks/use-allocation-check";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { CreateAllocationInput } from "@/types/resource";

/** Same delay as SearchInput: check after typing stops, not on every key. */
const CHECK_DEBOUNCE_MS = 300;

/**
 * Allocation check that follows the form while it is filled in. Pass the parsed form values
 * (null while incomplete or invalid). `isCurrent` is true only when the result belongs to
 * the values in the form now, so the dialog can wait for it before saving.
 */
export function useLiveAllocationCheck(input: CreateAllocationInput | null) {
  const debounced = useDebouncedValue(input, CHECK_DEBOUNCE_MS);
  // An incomplete form clears the check at once instead of after the delay.
  const check = useAllocationCheck(input && debounced.value);

  const isCurrent =
    input !== null && !debounced.isPending && check.isSuccess && !check.isPlaceholderData;

  return { check, isCurrent };
}
