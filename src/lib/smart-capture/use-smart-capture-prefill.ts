"use client";

import { useEffect, useState } from "react";

import { readSmartCapturePrefill } from "@/lib/smart-capture/prefill-session";

export function useSmartCapturePrefill<T extends Record<string, unknown>>(
  sessionKey: string,
  defaultValues: T,
): { values: T; ready: boolean } {
  const [values, setValues] = useState(defaultValues);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prefill = readSmartCapturePrefill<T>(sessionKey);
    if (prefill) {
      setValues((current) => ({ ...current, ...prefill }));
    }
    setReady(true);
  }, [sessionKey]);

  return { values, ready };
}
