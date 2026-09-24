"use client";

import { createContext, useContext } from "react";

interface HouseholdContextValue {
  householdId: string;
  householdName: string;
  userDisplayName: string;
}

const HouseholdContext = createContext<HouseholdContextValue | null>(null);

export function HouseholdProvider({
  children,
  householdId,
  householdName,
  userDisplayName,
}: HouseholdContextValue & { children: React.ReactNode }) {
  return (
    <HouseholdContext.Provider
      value={{ householdId, householdName, userDisplayName }}
    >
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold(): HouseholdContextValue {
  const ctx = useContext(HouseholdContext);
  if (!ctx) {
    throw new Error("useHousehold must be used within HouseholdProvider");
  }
  return ctx;
}
