"use server";

import { redirect } from "next/navigation";

import { getAppSession } from "@/lib/auth/session";
import { assertEntityInHousehold } from "@/lib/actions/entity-guard";
import { revalidateLifeAdminCore } from "@/lib/actions/revalidate";
import {
  financialAccountSchema,
  type FinancialAccountFormValues,
} from "@/features/money/schemas/financial-account.schema";
import { emptyToUndefined } from "@/lib/forms/parse";
import { getRepositories } from "@/lib/repositories";

function toEntity(values: FinancialAccountFormValues, householdId: string) {
  return {
    householdId,
    name: values.name,
    accountType: values.accountType,
    institution: emptyToUndefined(values.institution),
    ibanLast4: emptyToUndefined(values.ibanLast4),
    notes: emptyToUndefined(values.notes),
  };
}

export async function createFinancialAccountAction(
  values: FinancialAccountFormValues,
) {
  const parsed = financialAccountSchema.parse(values);
  const { householdId } = await getAppSession();
  const created = await getRepositories().financialAccounts.create(
    toEntity(parsed, householdId),
  );
  revalidateLifeAdminCore();
  redirect(`/money/${created.id}`);
}

export async function updateFinancialAccountAction(
  id: string,
  values: FinancialAccountFormValues,
) {
  const parsed = financialAccountSchema.parse(values);
  await getRepositories().financialAccounts.update(
    id,
    toEntity(parsed, (await getAppSession()).householdId),
  );
  revalidateLifeAdminCore();
  redirect(`/money/${id}`);
}

export async function deleteFinancialAccountAction(id: string) {
  const { householdId } = await getAppSession();
  const repos = getRepositories();
  await assertEntityInHousehold(
    (entityId) => repos.financialAccounts.getById(entityId),
    id,
    householdId,
  );
  await repos.financialAccounts.delete(id);
  revalidateLifeAdminCore();
  redirect("/money");
}
