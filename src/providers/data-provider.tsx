"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { HouseholdDataSnapshot } from "@/lib/domain/types";
import { getRepositories } from "@/lib/repositories";
import {
  getMockSessionSync,
  getMockSnapshotSync,
} from "@/lib/repositories/mock/sync";
import type { Repositories, SessionContext } from "@/lib/repositories/types";

type DataContextValue = {
  loading: boolean;
  error: string | null;
  session: SessionContext | null;
  snapshot: HouseholdDataSnapshot | null;
  repositories: Repositories;
  refresh: () => Promise<void>;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const repositories = useMemo(() => getRepositories(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<SessionContext | null>(
    getMockSessionSync,
  );
  const [snapshot, setSnapshot] = useState<HouseholdDataSnapshot | null>(
    getMockSnapshotSync,
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const nextSession = await repositories.household.getSession();
      const nextSnapshot = await repositories.household.getSnapshot(
        nextSession.household.id,
      );
      setSession(nextSession);
      setSnapshot(nextSnapshot);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [repositories]);

  const value = useMemo(
    () => ({
      loading,
      error,
      session,
      snapshot,
      repositories,
      refresh,
    }),
    [loading, error, session, snapshot, repositories, refresh],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within DataProvider");
  }
  return ctx;
}
