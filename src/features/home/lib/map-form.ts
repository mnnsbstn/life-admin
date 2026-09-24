import type { HomeItemFormValues } from "@/features/home/schemas/home-item.schema";
import type { HomeItem } from "@/lib/domain/types";

export function homeItemToFormValues(item: HomeItem): HomeItemFormValues {
  return {
    name: item.name,
    category: item.category,
    manufacturer: item.manufacturer ?? "",
    model: item.model ?? "",
    serialNumber: item.serialNumber ?? "",
    location: item.location ?? "",
    purchaseDate: item.purchaseDate ?? "",
    installationDate: item.installationDate ?? "",
    purchasePriceEuro:
      item.purchasePriceCents != null
        ? String(item.purchasePriceCents / 100)
        : "",
    warrantyEndsAt: item.warrantyEndsAt ?? "",
    lastMaintenanceAt: item.lastMaintenanceAt ?? "",
    nextMaintenanceAt: item.nextMaintenanceAt ?? "",
    notes: item.notes ?? "",
  };
}

export const emptyHomeItemFormValues: HomeItemFormValues = {
  name: "",
  category: "appliances",
  manufacturer: "",
  model: "",
  serialNumber: "",
  location: "",
  purchaseDate: "",
  installationDate: "",
  purchasePriceEuro: "",
  warrantyEndsAt: "",
  lastMaintenanceAt: "",
  nextMaintenanceAt: "",
  notes: "",
};
