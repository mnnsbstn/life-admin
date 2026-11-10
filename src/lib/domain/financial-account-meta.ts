import type { FinancialAccount } from "@/lib/domain/types";

export function getFinancialAccountSubtitle(
  account: FinancialAccount,
): string | undefined {
  return account.institution;
}

export function getFinancialAccountListMeta(
  account: FinancialAccount,
): string | undefined {
  if (account.ibanLast4) {
    return `··· ${account.ibanLast4}`;
  }
  return account.institution;
}
