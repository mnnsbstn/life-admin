import type { VehicleKind } from "@/lib/domain/types";

export const vehicleKindLabels: Record<VehicleKind, string> = {
  car: "Auto",
  motorcycle: "Motorrad",
  bicycle: "Fahrrad",
  camper: "Wohnmobil",
  other: "Sonstiges",
};
