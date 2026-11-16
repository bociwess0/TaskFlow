"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { isNotFoundError } from "@/services/api-error";

const MAX_RETRIES = 3;

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            // A missing resource (404) won't appear on retry; other errors keep the default retries.
            retry: (failureCount, error) => !isNotFoundError(error) && failureCount < MAX_RETRIES,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
