"use server";

import { redirect } from "next/navigation";

import { getAppSession } from "@/lib/auth/session";
import { assertEntityInHousehold } from "@/lib/actions/entity-guard";
import { revalidateLifeAdminCore } from "@/lib/actions/revalidate";
import { getRepositories } from "@/lib/repositories";

export async function completeReminder(reminderId: string) {
  const repos = getRepositories();
  const reminder = await repos.reminders.getById(reminderId);
  if (!reminder) {
    throw new Error("Reminder not found");
  }

  await repos.reminders.update(reminderId, {
    completedAt: new Date().toISOString(),
    status: "completed",
  });

  revalidateLifeAdminCore();
  redirect(`/reminders/${reminderId}`);
}

export async function reopenReminder(reminderId: string) {
  const repos = getRepositories();
  await repos.reminders.update(reminderId, {
    completedAt: undefined,
    status: "upcoming",
  });
  revalidateLifeAdminCore();
  redirect(`/reminders/${reminderId}`);
}

export async function deleteReminderAction(id: string) {
  const { householdId } = await getAppSession();
  const repos = getRepositories();
  await assertEntityInHousehold(
    (entityId) => repos.reminders.getById(entityId),
    id,
    householdId,
  );
  await repos.reminders.delete(id);
  revalidateLifeAdminCore();
  redirect("/reminders");
}
