import type { HomeItem, HomeItemCategory } from "@/lib/domain/types";

export interface HomeItemRow {
  id: string;
  household_id: string;
  name: string;
  category: HomeItemCategory;
  manufacturer: string | null;
  model: string | null;
  serial_number: string | null;
  location: string | null;
  purchase_date: string | null;
  installation_date: string | null;
  purchase_price_cents: number | null;
  currency: string | null;
  warranty_ends_at: string | null;
  last_maintenance_at: string | null;
  next_maintenance_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function mapHomeItemRow(row: HomeItemRow): HomeItem {
  return {
    id: row.id,
    householdId: row.household_id,
    name: row.name,
    category: row.category,
    manufacturer: row.manufacturer ?? undefined,
    model: row.model ?? undefined,
    serialNumber: row.serial_number ?? undefined,
    location: row.location ?? undefined,
    purchaseDate: row.purchase_date ?? undefined,
    installationDate: row.installation_date ?? undefined,
    purchasePriceCents: row.purchase_price_cents ?? undefined,
    currency: row.currency === "EUR" ? "EUR" : undefined,
    warrantyEndsAt: row.warranty_ends_at ?? undefined,
    lastMaintenanceAt: row.last_maintenance_at ?? undefined,
    nextMaintenanceAt: row.next_maintenance_at ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapHomeItemToRow(
  item: Omit<HomeItem, "id" | "createdAt" | "updatedAt">,
): Omit<HomeItemRow, "id" | "created_at" | "updated_at"> {
  return {
    household_id: item.householdId,
    name: item.name,
    category: item.category,
    manufacturer: item.manufacturer ?? null,
    model: item.model ?? null,
    serial_number: item.serialNumber ?? null,
    location: item.location ?? null,
    purchase_date: item.purchaseDate ?? null,
    installation_date: item.installationDate ?? null,
    purchase_price_cents: item.purchasePriceCents ?? null,
    currency: item.currency ?? null,
    warranty_ends_at: item.warrantyEndsAt ?? null,
    last_maintenance_at: item.lastMaintenanceAt ?? null,
    next_maintenance_at: item.nextMaintenanceAt ?? null,
    notes: item.notes ?? null,
  };
}
