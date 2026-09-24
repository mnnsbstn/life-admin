import { differenceInCalendarDays, parseISO, startOfDay } from "date-fns";

import { ATTENTION_HORIZON_DAYS } from "@/lib/domain/attention/config";
import type { AttentionItem, AttentionKind } from "@/lib/domain/attention/types";
import { resolveReminderStatus } from "@/lib/domain/reminders/reminder-status";
import type {
  Contract,
  Document,
  HomeItem,
  HouseholdDataSnapshot,
  Reminder,
} from "@/lib/domain/types";

function daysUntil(referenceDate: Date, isoDate: string): number {
  return differenceInCalendarDays(startOfDay(parseISO(isoDate)), referenceDate);
}

function urgencyFromDays(days: number, priorityBoost = 0): number {
  if (days < 0) return 1000 + Math.abs(days) + priorityBoost;
  if (days === 0) return 900 + priorityBoost;
  if (days <= 7) return 800 - days + priorityBoost;
  return 700 - days + priorityBoost;
}

function pushItem(
  items: AttentionItem[],
  params: Omit<AttentionItem, "id" | "urgencyScore"> & { urgencyScore?: number },
  days: number,
  priorityBoost = 0,
) {
  items.push({
    ...params,
    id: `${params.kind}:${params.entityId}`,
    urgencyScore: params.urgencyScore ?? urgencyFromDays(days, priorityBoost),
  });
}

function collectHomeItemAttention(
  items: AttentionItem[],
  item: HomeItem,
  referenceDate: Date,
) {
  if (item.warrantyEndDate) {
    const days = daysUntil(referenceDate, item.warrantyEndDate);
    if (days <= ATTENTION_HORIZON_DAYS) {
      pushItem(items, {
        kind: "warranty_expiring",
        title: `${item.name} warranty ending`,
        subtitle: item.manufacturer,
        dueDate: item.warrantyEndDate,
        entityType: "home_item",
        entityId: item.id,
        href: `/home/${item.id}`,
      }, days);
    }
  }

  if (item.nextMaintenanceDate) {
    const days = daysUntil(referenceDate, item.nextMaintenanceDate);
    if (days <= ATTENTION_HORIZON_DAYS) {
      pushItem(items, {
        kind: "maintenance_due",
        title: `${item.name} maintenance`,
        subtitle: item.location,
        dueDate: item.nextMaintenanceDate,
        entityType: "home_item",
        entityId: item.id,
        href: `/home/${item.id}`,
      }, days);
    }
  }
}

function collectContractAttention(
  items: AttentionItem[],
  contract: Contract,
  referenceDate: Date,
) {
  if (contract.contractEndDate) {
    const days = daysUntil(referenceDate, contract.contractEndDate);
    if (days <= ATTENTION_HORIZON_DAYS) {
      pushItem(items, {
        kind: "contract_expiring",
        title: `${contract.name} ending soon`,
        subtitle: contract.provider,
        dueDate: contract.contractEndDate,
        entityType: "contract",
        entityId: contract.id,
        href: `/contracts/${contract.id}`,
      }, days);
    }
  }

  if (contract.nextCancellationDate) {
    const days = daysUntil(referenceDate, contract.nextCancellationDate);
    if (days <= ATTENTION_HORIZON_DAYS && days >= 0) {
      pushItem(items, {
        kind: "contract_cancellation_window",
        title: `Cancel ${contract.name}`,
        subtitle: `Window opens · ${contract.provider}`,
        dueDate: contract.nextCancellationDate,
        entityType: "contract",
        entityId: contract.id,
        href: `/contracts/${contract.id}`,
      }, days);
    }
  }
}

function reminderPriorityBoost(priority: Reminder["priority"]): number {
  if (priority === "high") return 50;
  if (priority === "medium") return 20;
  return 0;
}

function collectReminderAttention(
  items: AttentionItem[],
  reminder: Reminder,
  referenceDate: Date,
) {
  const status = resolveReminderStatus(reminder, referenceDate);
  if (status === "completed") return;

  const days = daysUntil(referenceDate, reminder.dueDate);
  if (status === "due" || days <= ATTENTION_HORIZON_DAYS) {
    const kind: AttentionKind = "reminder_due";
    pushItem(
      items,
      {
        kind,
        title: reminder.title,
        subtitle: status === "due" && days < 0 ? "Overdue" : undefined,
        dueDate: reminder.dueDate,
        entityType: "reminder",
        entityId: reminder.id,
        href: `/reminders/${reminder.id}`,
      },
      days,
      reminderPriorityBoost(reminder.priority),
    );
  }
}

/** Optional V0.1 rule: flag important home items without any linked document. */
function collectMissingDocumentAttention(
  items: AttentionItem[],
  snapshot: HouseholdDataSnapshot,
) {
  const documentedHomeIds = new Set(
    snapshot.documents
      .filter((d) => d.homeItemId)
      .map((d) => d.homeItemId as string),
  );

  for (const item of snapshot.homeItems) {
    if (item.category === "heating" && !documentedHomeIds.has(item.id)) {
      pushItem(
        items,
        {
          kind: "document_missing",
          title: `Document missing for ${item.name}`,
          subtitle: "Add invoice or manual",
          dueDate: new Date().toISOString().slice(0, 10),
          entityType: "home_item",
          entityId: item.id,
          href: `/home/${item.id}`,
          urgencyScore: 400,
        },
        ATTENTION_HORIZON_DAYS,
      );
    }
  }
}

export function buildAttentionItems(
  snapshot: HouseholdDataSnapshot,
  referenceDate: Date = startOfDay(new Date()),
): AttentionItem[] {
  const items: AttentionItem[] = [];

  for (const item of snapshot.homeItems) {
    collectHomeItemAttention(items, item, referenceDate);
  }
  for (const contract of snapshot.contracts) {
    collectContractAttention(items, contract, referenceDate);
  }
  for (const reminder of snapshot.reminders) {
    collectReminderAttention(items, reminder, referenceDate);
  }
  collectMissingDocumentAttention(items, snapshot);

  return items.sort((a, b) => b.urgencyScore - a.urgencyScore);
}
