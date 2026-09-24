import { addDays, addMonths, parseISO, startOfDay } from "date-fns";

/**
 * Computes the last day to cancel before auto-renewal, when start date and terms are known.
 * V0.1: contracts may also store nextCancellationDate manually in seed/data entry.
 */
export function computeNextCancellationDate(params: {
  startDate: string;
  minimumTermMonths: number;
  noticePeriodDays: number;
}): string {
  const termEnd = addMonths(startOfDay(parseISO(params.startDate)), params.minimumTermMonths);
  const cancelBy = addDays(termEnd, -params.noticePeriodDays);
  return cancelBy.toISOString().slice(0, 10);
}
