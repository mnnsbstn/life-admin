"use server";

import { redirect } from "next/navigation";

import { getAppSession } from "@/lib/auth/session";
import { assertEntityInHousehold } from "@/lib/actions/entity-guard";
import { revalidateLifeAdminCore } from "@/lib/actions/revalidate";
import {
  contractSchema,
  type ContractFormValues,
} from "@/features/contracts/schemas/contract.schema";
import type { PaymentInterval } from "@/lib/domain/types";
import {
  emptyToUndefined,
  parseEuroToCents,
  parseOptionalInt,
} from "@/lib/forms/parse";
import { getRepositories } from "@/lib/repositories";

function toEntity(values: ContractFormValues, householdId: string) {
  const costCents = parseEuroToCents(values.costEuro);
  const paymentInterval = values.paymentInterval
    ? (values.paymentInterval as PaymentInterval)
    : undefined;

  return {
    householdId,
    name: values.name,
    provider: values.provider,
    category: values.category,
    costCents,
    currency: costCents ? ("EUR" as const) : undefined,
    paymentInterval,
    startDate: emptyToUndefined(values.startDate),
    minimumTermMonths: parseOptionalInt(values.minimumTermMonths),
    noticePeriodDays: parseOptionalInt(values.noticePeriodDays),
    nextCancellationDate: emptyToUndefined(values.nextCancellationDate),
    contractEndDate: emptyToUndefined(values.contractEndDate),
    autoRenewal: values.autoRenewal,
    notes: emptyToUndefined(values.notes),
  };
}

export async function createContractAction(values: ContractFormValues) {
  const parsed = contractSchema.parse(values);
  const { householdId } = await getAppSession();
  const created = await getRepositories().contracts.create(
    toEntity(parsed, householdId),
  );
  revalidateLifeAdminCore();
  redirect(`/contracts/${created.id}`);
}

export async function updateContractAction(
  id: string,
  values: ContractFormValues,
) {
  const parsed = contractSchema.parse(values);
  await getRepositories().contracts.update(
    id,
    toEntity(parsed, (await getAppSession()).householdId),
  );
  revalidateLifeAdminCore();
  redirect(`/contracts/${id}`);
}

export async function deleteContractAction(id: string) {
  const { householdId } = await getAppSession();
  const repos = getRepositories();
  await assertEntityInHousehold(
    (entityId) => repos.contracts.getById(entityId),
    id,
    householdId,
  );
  await repos.contracts.delete(id);
  revalidateLifeAdminCore();
  redirect("/contracts");
}
