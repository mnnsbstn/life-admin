import type { Metadata } from "next";

import { FinancialAccountListView } from "@/features/money/components/financial-account-list-view";
import { getAppSession } from "@/lib/auth/session";
import { sortFinancialAccounts } from "@/lib/domain/list-sort";
import { getRepositories } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "Finanzen",
};

export default async function MoneyPage() {
  const { householdId } = await getAppSession();
  const items = await getRepositories().financialAccounts.list({ householdId });

  return <FinancialAccountListView items={sortFinancialAccounts(items)} />;
}
