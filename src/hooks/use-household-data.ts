"use client";

import { useMemo } from "react";

import { buildAttentionItems } from "@/lib/domain/attention/build-attention";
import { buildUpcomingEvents } from "@/lib/domain/upcoming/build-upcoming";
import { useData } from "@/providers/data-provider";

export function useHouseholdData(referenceDate?: Date) {
  const { loading, error, session, snapshot, refresh, repositories } =
    useData();

  const attentionItems = useMemo(
    () => (snapshot ? buildAttentionItems(snapshot, referenceDate) : []),
    [snapshot, referenceDate],
  );

  const upcomingEvents = useMemo(
    () => (snapshot ? buildUpcomingEvents(snapshot, referenceDate) : []),
    [snapshot, referenceDate],
  );

  return {
    loading,
    error,
    session,
    snapshot,
    refresh,
    repositories,
    attentionItems,
    upcomingEvents,
  };
}
