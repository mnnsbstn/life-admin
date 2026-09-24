"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

import { HouseholdProvider } from "@/providers/household-context";

interface AppProvidersProps {
  children: React.ReactNode;
  householdId: string;
  householdName: string;
  userDisplayName: string;
}

export function AppProviders({
  children,
  householdId,
  householdName,
  userDisplayName,
}: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HouseholdProvider
        householdId={householdId}
        householdName={householdName}
        userDisplayName={userDisplayName}
      >
        {children}
        <Toaster richColors position="top-center" />
      </HouseholdProvider>
    </QueryClientProvider>
  );
}
