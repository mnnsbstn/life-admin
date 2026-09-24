import type {
  Contract,
  ContractCategory,
  PaymentInterval,
} from "@/lib/domain/types";

export interface ContractRow {
  id: string;
  household_id: string;
  name: string;
  provider: string;
  category: ContractCategory;
  cost_cents: number | null;
  currency: string | null;
  payment_interval: PaymentInterval | null;
  start_date: string | null;
  minimum_term_months: number | null;
  notice_period_days: number | null;
  next_cancellation_date: string | null;
  auto_renewal: boolean | null;
  contract_end_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function mapContractRow(row: ContractRow): Contract {
  return {
    id: row.id,
    householdId: row.household_id,
    name: row.name,
    provider: row.provider,
    category: row.category,
    costCents: row.cost_cents ?? undefined,
    currency: row.currency === "EUR" ? "EUR" : undefined,
    paymentInterval: row.payment_interval ?? undefined,
    startDate: row.start_date ?? undefined,
    minimumTermMonths: row.minimum_term_months ?? undefined,
    noticePeriodDays: row.notice_period_days ?? undefined,
    nextCancellationDate: row.next_cancellation_date ?? undefined,
    autoRenewal: row.auto_renewal ?? undefined,
    contractEndDate: row.contract_end_date ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapContractToRow(
  item: Omit<Contract, "id" | "createdAt" | "updatedAt">,
): Omit<ContractRow, "id" | "created_at" | "updated_at"> {
  return {
    household_id: item.householdId,
    name: item.name,
    provider: item.provider,
    category: item.category,
    cost_cents: item.costCents ?? null,
    currency: item.currency ?? null,
    payment_interval: item.paymentInterval ?? null,
    start_date: item.startDate ?? null,
    minimum_term_months: item.minimumTermMonths ?? null,
    notice_period_days: item.noticePeriodDays ?? null,
    next_cancellation_date: item.nextCancellationDate ?? null,
    auto_renewal: item.autoRenewal ?? null,
    contract_end_date: item.contractEndDate ?? null,
    notes: item.notes ?? null,
  };
}
