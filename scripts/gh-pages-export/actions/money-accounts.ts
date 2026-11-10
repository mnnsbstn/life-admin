import type { FinancialAccountFormValues } from "@/features/money/schemas/financial-account.schema";

async function blocked(): Promise<never> {
  throw new Error("Read-only GitHub Pages demo");
}

export async function createFinancialAccountAction(
  _values: FinancialAccountFormValues,
) {
  return blocked();
}

export async function updateFinancialAccountAction(
  _id: string,
  _values: FinancialAccountFormValues,
) {
  return blocked();
}

export async function deleteFinancialAccountAction(_id: string) {
  return blocked();
}
