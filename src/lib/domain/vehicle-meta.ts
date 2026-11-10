import type { Vehicle } from "@/lib/domain/types";
import { formatDisplayDate } from "@/lib/format/date";

export function getVehicleSubtitle(vehicle: Vehicle): string | undefined {
  const parts = [vehicle.make, vehicle.model].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

export function getVehicleListMeta(vehicle: Vehicle): string | undefined {
  if (vehicle.licensePlate) return vehicle.licensePlate;
  if (vehicle.nextInspectionAt) {
    return `HU: ${formatDisplayDate(vehicle.nextInspectionAt)}`;
  }
  if (vehicle.insuranceEndsAt) {
    return `Versicherung bis: ${formatDisplayDate(vehicle.insuranceEndsAt)}`;
  }
  return undefined;
}
