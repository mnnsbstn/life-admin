import type { FinancialAccountType } from "@/lib/domain/types";

export const financialAccountTypeLabels: Record<FinancialAccountType, string> = {
  checking: "Girokonto",
  savings: "Sparkonto",
  investment: "Depot",
  credit: "Kreditkarte",
  cash: "Bargeld",
  other: "Sonstiges",
};
