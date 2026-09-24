import type { HomeItem } from "@/lib/domain/types";
import { formatDisplayDate } from "@/lib/format/date";

export function getHomeItemListMeta(item: HomeItem): string | undefined {
  if (item.nextMaintenanceAt) {
    return `Nächste Wartung: ${formatDisplayDate(item.nextMaintenanceAt)}`;
  }
  if (item.warrantyEndsAt) {
    return `Garantie bis: ${formatDisplayDate(item.warrantyEndsAt)}`;
  }
  if (item.location) {
    return item.location;
  }
  return undefined;
}

export function getHomeItemSubtitle(item: HomeItem): string | undefined {
  const parts = [item.manufacturer, item.model].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : undefined;
}
