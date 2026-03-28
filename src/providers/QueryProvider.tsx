"use client";

import { ReactNode, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/* ================= TYPES ================= */

interface QueryProviderProps {
  children: ReactNode;
}

/* ================= COMPONENT ================= */

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState<QueryClient>(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          refetchOnWindowFocus: false,
          refetchOnReconnect: true,
          retry: 3,
          retryDelay: (attemptIndex: number) =>
            Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        mutations: {
          retry: 1,
          onError: (error: unknown) => {
            console.error("Mutation error:", error);
          },
        },
      },
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  );
}