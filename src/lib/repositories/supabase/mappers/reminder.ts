import { withDerivedReminderStatus } from "@/lib/domain/reminder-status";
import type {
  Reminder,
  ReminderLink,
  ReminderPriority,
  ReminderStatus,
} from "@/lib/domain/types";

export interface ReminderRow {
  id: string;
  household_id: string;
  title: string;
  due_date: string;
  status: ReminderStatus;
  priority: ReminderPriority;
  link_type: "standalone" | "home_item" | "contract";
  link_target_id: string | null;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

function mapLinkFromRow(row: ReminderRow): ReminderLink {
  if (row.link_type === "home_item" && row.link_target_id) {
    return { type: "home_item", id: row.link_target_id };
  }
  if (row.link_type === "contract" && row.link_target_id) {
    return { type: "contract", id: row.link_target_id };
  }
  return { type: "standalone" };
}

function mapLinkToRow(link: ReminderLink): Pick<ReminderRow, "link_type" | "link_target_id"> {
  if (link.type === "home_item") {
    return { link_type: "home_item", link_target_id: link.id };
  }
  if (link.type === "contract") {
    return { link_type: "contract", link_target_id: link.id };
  }
  return { link_type: "standalone", link_target_id: null };
}

export function mapReminderRow(row: ReminderRow): Reminder {
  const base: Reminder = {
    id: row.id,
    householdId: row.household_id,
    title: row.title,
    dueDate: row.due_date,
    status: row.status,
    priority: row.priority,
    link: mapLinkFromRow(row),
    notes: row.notes ?? undefined,
    completedAt: row.completed_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  return withDerivedReminderStatus(base);
}

export function mapReminderToRow(
  item: Omit<Reminder, "id" | "createdAt" | "updatedAt">,
): Omit<ReminderRow, "id" | "created_at" | "updated_at"> {
  const linkRow = mapLinkToRow(item.link);

  return {
    household_id: item.householdId,
    title: item.title,
    due_date: item.dueDate,
    status: item.status,
    priority: item.priority,
    ...linkRow,
    notes: item.notes ?? null,
    completed_at: item.completedAt ?? null,
  };
}
