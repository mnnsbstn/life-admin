"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { reminderFormSchema } from "@/lib/domain/types/reminder";
import { DEMO_HOUSEHOLD_ID, getRepositories } from "@/lib/repositories";

function parseReminderForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return {
    ...raw,
    homeItemId: raw.homeItemId || null,
    contractId: raw.contractId || null,
  };
}

export async function createReminderAction(formData: FormData) {
  const parsed = reminderFormSchema.safeParse(parseReminderForm(formData));
  if (!parsed.success) {
    return;
  }
  const item = getRepositories().reminders.create(DEMO_HOUSEHOLD_ID, parsed.data);
  revalidatePath("/reminders");
  revalidatePath("/today");
  redirect(`/reminders/${item.id}`);
}

export async function updateReminderAction(id: string, formData: FormData) {
  const parsed = reminderFormSchema.partial().safeParse(parseReminderForm(formData));
  if (!parsed.success) {
    return;
  }
  getRepositories().reminders.update(id, parsed.data);
  revalidatePath("/reminders");
  revalidatePath(`/reminders/${id}`);
  revalidatePath("/today");
  redirect(`/reminders/${id}`);
}

export async function completeReminderAction(id: string) {
  getRepositories().reminders.update(id, {
    status: "completed",
    completedAt: new Date().toISOString(),
  });
  revalidatePath("/reminders");
  revalidatePath(`/reminders/${id}`);
  revalidatePath("/today");
}
