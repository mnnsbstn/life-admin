import type { VehicleFormValues } from "@/features/vehicles/schemas/vehicle.schema";
import type { Vehicle } from "@/lib/domain/types";

export function vehicleToFormValues(vehicle: Vehicle): VehicleFormValues {
  return {
    name: vehicle.name,
    kind: vehicle.kind,
    make: vehicle.make ?? "",
    model: vehicle.model ?? "",
    licensePlate: vehicle.licensePlate ?? "",
    year: vehicle.year != null ? String(vehicle.year) : "",
    nextInspectionAt: vehicle.nextInspectionAt ?? "",
    insuranceEndsAt: vehicle.insuranceEndsAt ?? "",
    notes: vehicle.notes ?? "",
  };
}

export const emptyVehicleFormValues: VehicleFormValues = {
  name: "",
  kind: "car",
  make: "",
  model: "",
  licensePlate: "",
  year: "",
  nextInspectionAt: "",
  insuranceEndsAt: "",
  notes: "",
};
