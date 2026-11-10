import type { FinancialAccountFormValues } from "@/features/money/schemas/financial-account.schema";
import type { FinancialAccount } from "@/lib/domain/types";

export function financialAccountToFormValues(
  account: FinancialAccount,
): FinancialAccountFormValues {
  return {
    name: account.name,
    accountType: account.accountType,
    institution: account.institution ?? "",
    ibanLast4: account.ibanLast4 ?? "",
    notes: account.notes ?? "",
  };
}

export const emptyFinancialAccountFormValues: FinancialAccountFormValues = {
  name: "",
  accountType: "checking",
  institution: "",
  ibanLast4: "",
  notes: "",
};
