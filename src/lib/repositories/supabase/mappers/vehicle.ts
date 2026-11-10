import type { Vehicle, VehicleKind } from "@/lib/domain/types";

export interface VehicleRow {
  id: string;
  household_id: string;
  name: string;
  kind: VehicleKind;
  make: string | null;
  model: string | null;
  license_plate: string | null;
  year: number | null;
  next_inspection_at: string | null;
  insurance_ends_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function mapVehicleRow(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    householdId: row.household_id,
    name: row.name,
    kind: row.kind,
    make: row.make ?? undefined,
    model: row.model ?? undefined,
    licensePlate: row.license_plate ?? undefined,
    year: row.year ?? undefined,
    nextInspectionAt: row.next_inspection_at ?? undefined,
    insuranceEndsAt: row.insurance_ends_at ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapVehicleToRow(
  item: Omit<Vehicle, "id" | "createdAt" | "updatedAt">,
): Omit<VehicleRow, "id" | "created_at" | "updated_at"> {
  return {
    household_id: item.householdId,
    name: item.name,
    kind: item.kind,
    make: item.make ?? null,
    model: item.model ?? null,
    license_plate: item.licensePlate ?? null,
    year: item.year ?? null,
    next_inspection_at: item.nextInspectionAt ?? null,
    insurance_ends_at: item.insuranceEndsAt ?? null,
    notes: item.notes ?? null,
  };
}
