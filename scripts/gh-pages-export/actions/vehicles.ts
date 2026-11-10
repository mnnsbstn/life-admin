import type { VehicleFormValues } from "@/features/vehicles/schemas/vehicle.schema";

async function blocked(): Promise<never> {
  throw new Error("Read-only GitHub Pages demo");
}

export async function createVehicleAction(_values: VehicleFormValues) {
  return blocked();
}

export async function updateVehicleAction(
  _id: string,
  _values: VehicleFormValues,
) {
  return blocked();
}

export async function deleteVehicleAction(_id: string) {
  return blocked();
}
