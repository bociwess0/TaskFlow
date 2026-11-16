"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useSearchParamsUpdater } from "@/hooks/use-search-params-updater";

const TASK_PARAM = "task";

/**
 * The task open in the details panel, kept in the URL (?task=t-5) so the link can be shared.
 * Opening adds a history entry, so the browser Back button closes the panel.
 * Use it once per page (ProjectBoard) and pass the functions down.
 */
export function useOpenTask() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const updateSearchParams = useSearchParamsUpdater();
  // Whether this page added the history entry; a shared link opens the panel without one.
  const [openedHere, setOpenedHere] = useState(false);

  const openTaskId = searchParams.get(TASK_PARAM);

  // The panel was closed some other way (browser Back), so the entry is gone.
  if (!openTaskId && openedHere) {
    setOpenedHere(false);
  }

  const openTask = useCallback(
    (taskId: string) => {
      // Switching tasks while the panel is open replaces the entry instead of stacking them.
      updateSearchParams({ [TASK_PARAM]: taskId }, { push: !openedHere });
      setOpenedHere(true);
    },
    [openedHere, updateSearchParams],
  );

  const closeTask = useCallback(() => {
    if (openedHere) {
      // Same as the browser Back button: return to the entry before the panel.
      router.back();
    } else {
      updateSearchParams({ [TASK_PARAM]: undefined });
    }
  }, [openedHere, router, updateSearchParams]);

  return { openTaskId, openTask, closeTask };
}
