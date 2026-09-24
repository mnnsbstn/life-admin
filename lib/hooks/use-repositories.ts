"use client";

import { useMemo } from "react";
import { getRepositories } from "@/lib/repositories";
import type { DataSource } from "@/lib/repositories/types";

export function useRepositories(source: DataSource = "mock") {
  return useMemo(() => getRepositories(source), [source]);
}
