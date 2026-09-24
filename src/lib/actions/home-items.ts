"use server";

import { redirect } from "next/navigation";

import { getDemoSession } from "@/lib/auth/demo-session";
import { revalidateLifeAdminCore } from "@/lib/actions/revalidate";
import {
  homeItemSchema,
  type HomeItemFormValues,
} from "@/features/home/schemas/home-item.schema";
import {
  emptyToUndefined,
  parseEuroToCents,
} from "@/lib/forms/parse";
import { getRepositories } from "@/lib/repositories";

function toEntity(values: HomeItemFormValues, householdId: string) {
  const purchasePriceCents = parseEuroToCents(values.purchasePriceEuro);

  return {
    householdId,
    name: values.name,
    category: values.category,
    manufacturer: emptyToUndefined(values.manufacturer),
    model: emptyToUndefined(values.model),
    serialNumber: emptyToUndefined(values.serialNumber),
    location: emptyToUndefined(values.location),
    purchaseDate: emptyToUndefined(values.purchaseDate),
    installationDate: emptyToUndefined(values.installationDate),
    purchasePriceCents,
    currency: purchasePriceCents ? ("EUR" as const) : undefined,
    warrantyEndsAt: emptyToUndefined(values.warrantyEndsAt),
    lastMaintenanceAt: emptyToUndefined(values.lastMaintenanceAt),
    nextMaintenanceAt: emptyToUndefined(values.nextMaintenanceAt),
    notes: emptyToUndefined(values.notes),
  };
}

export async function createHomeItemAction(values: HomeItemFormValues) {
  const parsed = homeItemSchema.parse(values);
  const { householdId } = await getDemoSession();
  const created = await getRepositories().homeItems.create(
    toEntity(parsed, householdId),
  );
  revalidateLifeAdminCore();
  redirect(`/home/${created.id}`);
}

export async function updateHomeItemAction(id: string, values: HomeItemFormValues) {
  const parsed = homeItemSchema.parse(values);
  await getRepositories().homeItems.update(
    id,
    toEntity(parsed, (await getDemoSession()).householdId),
  );
  revalidateLifeAdminCore();
  redirect(`/home/${id}`);
}
