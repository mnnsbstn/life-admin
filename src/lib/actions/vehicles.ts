"use server";

import { redirect } from "next/navigation";

import { getAppSession } from "@/lib/auth/session";
import { assertEntityInHousehold } from "@/lib/actions/entity-guard";
import { revalidateLifeAdminCore } from "@/lib/actions/revalidate";
import {
  vehicleSchema,
  type VehicleFormValues,
} from "@/features/vehicles/schemas/vehicle.schema";
import { emptyToUndefined, parseOptionalInt } from "@/lib/forms/parse";
import { getRepositories } from "@/lib/repositories";

function toEntity(values: VehicleFormValues, householdId: string) {
  return {
    householdId,
    name: values.name,
    kind: values.kind,
    make: emptyToUndefined(values.make),
    model: emptyToUndefined(values.model),
    licensePlate: emptyToUndefined(values.licensePlate),
    year: parseOptionalInt(values.year),
    nextInspectionAt: emptyToUndefined(values.nextInspectionAt),
    insuranceEndsAt: emptyToUndefined(values.insuranceEndsAt),
    notes: emptyToUndefined(values.notes),
  };
}

export async function createVehicleAction(values: VehicleFormValues) {
  const parsed = vehicleSchema.parse(values);
  const { householdId } = await getAppSession();
  const created = await getRepositories().vehicles.create(
    toEntity(parsed, householdId),
  );
  revalidateLifeAdminCore();
  redirect(`/vehicles/${created.id}`);
}

export async function updateVehicleAction(id: string, values: VehicleFormValues) {
  const parsed = vehicleSchema.parse(values);
  await getRepositories().vehicles.update(
    id,
    toEntity(parsed, (await getAppSession()).householdId),
  );
  revalidateLifeAdminCore();
  redirect(`/vehicles/${id}`);
}

export async function deleteVehicleAction(id: string) {
  const { householdId } = await getAppSession();
  const repos = getRepositories();
  await assertEntityInHousehold(
    (entityId) => repos.vehicles.getById(entityId),
    id,
    householdId,
  );
  await repos.vehicles.delete(id);
  revalidateLifeAdminCore();
  redirect("/vehicles");
}
