import type { AttentionKind, AttentionSeverity } from "@/lib/domain/enums";
import type { Contract } from "@/lib/domain/types/contract";
import type { Document } from "@/lib/domain/types/document";
import type { HomeItem } from "@/lib/domain/types/home-item";
import type { Reminder } from "@/lib/domain/types/reminder";
import { ATTENTION_WINDOW_DAYS, MAX_ATTENTION_ITEMS } from "@/config/attention-rules";
import { cancellationDateIso, daysUntil, renewalDate } from "./dates";
import { parseDateOnly, resolveReminderStatus, startOfToday } from "./reminder-status";

export type AttentionItem = {
  id: string;
  severity: AttentionSeverity;
  kind: AttentionKind;
  title: string;
  subtitle?: string;
  dueDate?: string;
  href: string;
  entityType: "home" | "contract" | "reminder" | "document";
  entityId: string;
};

type Snapshot = {
  homeItems: HomeItem[];
  contracts: Contract[];
  documents: Document[];
  reminders: Reminder[];
};

function sortAttention(a: AttentionItem, b: AttentionItem): number {
  const today = startOfToday().getTime();
  const score = (item: AttentionItem) => {
    if (!item.dueDate) return 1000;
    const t = parseDateOnly(item.dueDate).getTime();
    if (t < today) return 0;
    if (t === today) return 1;
    const in7 = today + 7 * 86400000;
    if (t <= in7) return 2;
    return 3;
  };
  const sa = score(a);
  const sb = score(b);
  if (sa !== sb) return sa - sb;
  if (a.dueDate && b.dueDate) {
    return parseDateOnly(a.dueDate).getTime() - parseDateOnly(b.dueDate).getTime();
  }
  return 0;
}

function buildAttentionItems(snapshot: Snapshot): AttentionItem[] {
  const items: AttentionItem[] = [];
  const window = ATTENTION_WINDOW_DAYS;
  const today = startOfToday();

  for (const item of snapshot.homeItems) {
    if (item.warrantyEndsAt) {
      const days = daysUntil(item.warrantyEndsAt);
      if (days >= 0 && days <= window) {
        items.push({
          id: `warranty-${item.id}`,
          severity: days <= 7 ? "warning" : "info",
          kind: "warranty_ending",
          title: `${item.name} warranty ending`,
          subtitle: item.manufacturer ?? undefined,
          dueDate: item.warrantyEndsAt,
          href: `/home/${item.id}`,
          entityType: "home",
          entityId: item.id,
        });
      }
    }
    if (item.nextMaintenanceAt) {
      const days = daysUntil(item.nextMaintenanceAt);
      if (days >= 0 && days <= window) {
        items.push({
          id: `maint-${item.id}`,
          severity: days <= 7 ? "warning" : "info",
          kind: "maintenance_due",
          title: `${item.name} maintenance due`,
          subtitle: item.location ?? undefined,
          dueDate: item.nextMaintenanceAt,
          href: `/home/${item.id}`,
          entityType: "home",
          entityId: item.id,
        });
      }
    }
  }

  for (const contract of snapshot.contracts) {
    const cancelIso = cancellationDateIso(contract);
    if (cancelIso) {
      const days = daysUntil(cancelIso);
      if (days >= 0 && days <= window) {
        items.push({
          id: `cancel-${contract.id}`,
          severity: days <= 14 ? "warning" : "info",
          kind: "cancellation_window",
          title: `Cancellation window: ${contract.name}`,
          subtitle: contract.provider,
          dueDate: cancelIso,
          href: `/contracts/${contract.id}`,
          entityType: "contract",
          entityId: contract.id,
        });
      }
    }
    if (contract.autoRenewal) {
      const renew = renewalDate(contract);
      if (renew) {
        const iso = renew.toISOString().slice(0, 10);
        const days = daysUntil(iso);
        if (days >= 0 && days <= window) {
          items.push({
            id: `renew-${contract.id}`,
            severity: "info",
            kind: "renewal_soon",
            title: `${contract.name} renews soon`,
            subtitle: contract.provider,
            dueDate: iso,
            href: `/contracts/${contract.id}`,
            entityType: "contract",
            entityId: contract.id,
          });
        }
      }
    }
    const hasContractDoc = snapshot.documents.some(
      (d) => d.contractId === contract.id && d.type === "contract",
    );
    if (!hasContractDoc) {
      items.push({
        id: `doc-missing-${contract.id}`,
        severity: "info",
        kind: "document_missing",
        title: "Missing contract document",
        subtitle: contract.name,
        href: `/contracts/${contract.id}`,
        entityType: "contract",
        entityId: contract.id,
      });
    }
  }

  for (const reminder of snapshot.reminders) {
    const status = resolveReminderStatus(reminder);
    if (status === "completed") continue;
    const due = parseDateOnly(reminder.dueDate);
    const days = daysUntil(reminder.dueDate);
    if (due.getTime() < today.getTime()) {
      items.push({
        id: `rem-over-${reminder.id}`,
        severity: "critical",
        kind: "reminder_overdue",
        title: reminder.title,
        subtitle: "Overdue reminder",
        dueDate: reminder.dueDate,
        href: `/reminders/${reminder.id}`,
        entityType: "reminder",
        entityId: reminder.id,
      });
    } else if (days <= window) {
      items.push({
        id: `rem-due-${reminder.id}`,
        severity: due.getTime() === today.getTime() ? "warning" : "info",
        kind: "reminder_due",
        title: reminder.title,
        dueDate: reminder.dueDate,
        href: `/reminders/${reminder.id}`,
        entityType: "reminder",
        entityId: reminder.id,
      });
    }
  }

  items.sort(sortAttention);
  return items;
}

export function generateAttentionItems(snapshot: Snapshot): AttentionItem[] {
  return buildAttentionItems(snapshot).slice(0, MAX_ATTENTION_ITEMS);
}

export function getAttentionCount(snapshot: Snapshot): number {
  return buildAttentionItems(snapshot).length;
}
