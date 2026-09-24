"use server";

import { redirect } from "next/navigation";

import { getDemoSession } from "@/lib/auth/demo-session";
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

export async function deleteReminder(reminderId: string) {
  // Mock repo has no delete - skip for V0.1 or implement in store
  void reminderId;
  const session = await getDemoSession();
  void session;
}
