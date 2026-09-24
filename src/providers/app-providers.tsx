"use client";

import { DataProvider } from "@/providers/data-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <DataProvider>{children}</DataProvider>;
}
