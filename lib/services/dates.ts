import { addDays, addMonths, parseISO, subDays } from "date-fns";
import type { Contract } from "@/lib/domain/types/contract";
import { parseDateOnly } from "./reminder-status";

export function daysUntil(isoDate: string, from = new Date()): number {
  const target = parseDateOnly(isoDate);
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);
  const diff = target.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function nextPossibleCancellationDate(contract: Contract): Date | null {
  if (!contract.startDate) return null;
  const start = parseDateOnly(contract.startDate);
  const minEnd = contract.minimumTermMonths
    ? addMonths(start, contract.minimumTermMonths)
    : start;
  const noticeDays = contract.noticePeriodDays ?? 0;
  let windowEnd = minEnd;
  if (contract.autoRenewal && contract.renewalPeriodMonths) {
    const now = new Date();
    let periodStart = minEnd;
    while (periodStart <= now) {
      windowEnd = addMonths(periodStart, contract.renewalPeriodMonths);
      periodStart = windowEnd;
    }
  }
  return subDays(windowEnd, noticeDays);
}

export function cancellationDateIso(contract: Contract): string | null {
  const d = nextPossibleCancellationDate(contract);
  return d ? d.toISOString().slice(0, 10) : null;
}

export function renewalDate(contract: Contract): Date | null {
  if (!contract.autoRenewal || !contract.startDate || !contract.renewalPeriodMonths) {
    return null;
  }
  const start = parseDateOnly(contract.startDate);
  const minEnd = contract.minimumTermMonths
    ? addMonths(start, contract.minimumTermMonths)
    : start;
  const now = new Date();
  let periodEnd = minEnd;
  while (periodEnd <= now) {
    periodEnd = addMonths(periodEnd, contract.renewalPeriodMonths);
  }
  return periodEnd;
}

export function addDaysToIso(iso: string, days: number): string {
  return addDays(parseISO(iso.includes("T") ? iso : `${iso}T12:00:00`), days)
    .toISOString()
    .slice(0, 10);
}
