"use server";

import { redirect } from "next/navigation";

import { getDemoSession } from "@/lib/auth/demo-session";
import { revalidateLifeAdminCore } from "@/lib/actions/revalidate";
import {
  reminderSchema,
  type ReminderFormValues,
} from "@/features/reminders/schemas/reminder.schema";
import type { ReminderLink } from "@/lib/domain/types";
import { withDerivedReminderStatus } from "@/lib/domain/reminder-status";
import { emptyToUndefined } from "@/lib/forms/parse";
import { getRepositories } from "@/lib/repositories";

function toLink(values: ReminderFormValues): ReminderLink {
  if (values.linkType === "home_item" && values.linkTargetId) {
    return { type: "home_item", id: values.linkTargetId };
  }
  if (values.linkType === "contract" && values.linkTargetId) {
    return { type: "contract", id: values.linkTargetId };
  }
  return { type: "standalone" };
}

function toEntity(values: ReminderFormValues, householdId: string) {
  const base = {
    householdId,
    title: values.title,
    dueDate: values.dueDate,
    priority: values.priority,
    link: toLink(values),
    notes: emptyToUndefined(values.notes),
  };
  return {
    ...base,
    status: withDerivedReminderStatus({
      ...base,
      id: "temp",
      createdAt: "",
      updatedAt: "",
      status: "upcoming",
    }).status,
  };
}

export async function createReminderAction(values: ReminderFormValues) {
  const parsed = reminderSchema.parse(values);
  const { householdId } = await getDemoSession();
  const created = await getRepositories().reminders.create(
    toEntity(parsed, householdId),
  );
  revalidateLifeAdminCore();
  redirect(`/reminders/${created.id}`);
}

export async function updateReminderAction(
  id: string,
  values: ReminderFormValues,
) {
  const parsed = reminderSchema.parse(values);
  await getRepositories().reminders.update(
    id,
    toEntity(parsed, (await getDemoSession()).householdId),
  );
  revalidateLifeAdminCore();
  redirect(`/reminders/${id}`);
}
