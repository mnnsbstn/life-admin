"use client";

import { useMemo, useSyncExternalStore } from "react";

import { readSmartCapturePrefill } from "@/lib/smart-capture/prefill-session";

function emptySubscribe() {
  return () => {};
}

export function useSmartCapturePrefill<T extends Record<string, unknown>>(
  sessionKey: string,
  defaultValues: T,
): { values: T; ready: boolean } {
  const ready = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const values = useMemo(() => {
    if (!ready) return defaultValues;
    const prefill = readSmartCapturePrefill<T>(sessionKey);
    return prefill ? { ...defaultValues, ...prefill } : defaultValues;
  }, [ready, sessionKey, defaultValues]);

  return { values, ready };
}
