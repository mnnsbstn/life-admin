import type { Contract } from "@/lib/domain/types";
import { formatEuroFromCents } from "@/lib/format/currency";
import { formatDisplayDate } from "@/lib/format/date";
import { paymentIntervalLabels } from "@/config/payment-intervals";

export function getContractCostLabel(contract: Contract): string | undefined {
  if (contract.costCents == null) return undefined;
  const cost = formatEuroFromCents(contract.costCents);
  if (contract.paymentInterval) {
    return `${cost} · ${paymentIntervalLabels[contract.paymentInterval]}`;
  }
  return cost;
}

export function getContractListMeta(contract: Contract): string | undefined {
  if (contract.nextCancellationDate) {
    return `Kündigung möglich ab ${formatDisplayDate(contract.nextCancellationDate)}`;
  }
  if (contract.contractEndDate) {
    return `Vertragsende: ${formatDisplayDate(contract.contractEndDate)}`;
  }
  return undefined;
}
