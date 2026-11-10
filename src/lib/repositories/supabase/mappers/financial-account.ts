import type { FinancialAccount, FinancialAccountType } from "@/lib/domain/types";

export interface FinancialAccountRow {
  id: string;
  household_id: string;
  name: string;
  account_type: FinancialAccountType;
  institution: string | null;
  iban_last4: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function mapFinancialAccountRow(row: FinancialAccountRow): FinancialAccount {
  return {
    id: row.id,
    householdId: row.household_id,
    name: row.name,
    accountType: row.account_type,
    institution: row.institution ?? undefined,
    ibanLast4: row.iban_last4 ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapFinancialAccountToRow(
  item: Omit<FinancialAccount, "id" | "createdAt" | "updatedAt">,
): Omit<FinancialAccountRow, "id" | "created_at" | "updated_at"> {
  return {
    household_id: item.householdId,
    name: item.name,
    account_type: item.accountType,
    institution: item.institution ?? null,
    iban_last4: item.ibanLast4 ?? null,
    notes: item.notes ?? null,
  };
}
