import type { ContractFormValues } from "@/features/contracts/schemas/contract.schema";
import type { Contract } from "@/lib/domain/types";

export function contractToFormValues(contract: Contract): ContractFormValues {
  return {
    name: contract.name,
    provider: contract.provider,
    category: contract.category,
    costEuro:
      contract.costCents != null ? String(contract.costCents / 100) : "",
    paymentInterval: contract.paymentInterval ?? "",
    startDate: contract.startDate ?? "",
    minimumTermMonths:
      contract.minimumTermMonths != null
        ? String(contract.minimumTermMonths)
        : "",
    noticePeriodDays:
      contract.noticePeriodDays != null
        ? String(contract.noticePeriodDays)
        : "",
    nextCancellationDate: contract.nextCancellationDate ?? "",
    contractEndDate: contract.contractEndDate ?? "",
    autoRenewal: contract.autoRenewal ?? true,
    notes: contract.notes ?? "",
  };
}

export const emptyContractFormValues: ContractFormValues = {
  name: "",
  provider: "",
  category: "other",
  costEuro: "",
  paymentInterval: "",
  startDate: "",
  minimumTermMonths: "",
  noticePeriodDays: "",
  nextCancellationDate: "",
  contractEndDate: "",
  autoRenewal: true,
  notes: "",
};
