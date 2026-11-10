import { addMonths, formatISO, parseISO, subDays } from "date-fns";

import type { Contract } from "@/lib/domain/types";

/** End of minimum term (calendar months from contract start). */
export function computeMinimumTermEnd(
  startDate: string,
  minimumTermMonths: number,
): string {
  return formatISO(addMonths(parseISO(startDate), minimumTermMonths), {
    representation: "date",
  });
}

/**
 * Last calendar day to give notice to cancel at the end of the minimum term.
 * Used as attention date when `nextCancellationDate` is not set manually.
 */
export function computeNoticeDeadline(
  termEndDate: string,
  noticePeriodDays: number,
): string {
  return formatISO(subDays(parseISO(termEndDate), noticePeriodDays), {
    representation: "date",
  });
}

type CancellationInput = Pick<
  Contract,
  | "startDate"
  | "minimumTermMonths"
  | "noticePeriodDays"
  | "nextCancellationDate"
>;

/** Explicit `nextCancellationDate` wins; otherwise derive from term + notice period. */
export function resolveNextCancellationDate(
  contract: CancellationInput,
): string | undefined {
  if (contract.nextCancellationDate) {
    return contract.nextCancellationDate;
  }

  if (
    !contract.startDate ||
    contract.minimumTermMonths == null ||
    contract.noticePeriodDays == null
  ) {
    return undefined;
  }

  const termEnd = computeMinimumTermEnd(
    contract.startDate,
    contract.minimumTermMonths,
  );
  return computeNoticeDeadline(termEnd, contract.noticePeriodDays);
}
