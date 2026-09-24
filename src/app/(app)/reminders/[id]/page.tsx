import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ModulePlaceholder } from "@/components/shell/module-placeholder";
import { getRepositories } from "@/lib/repositories";

interface ReminderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ReminderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const reminder = await getRepositories().reminders.getById(id);
  return { title: reminder?.title ?? "Reminder" };
}

export default async function ReminderDetailPage({
  params,
}: ReminderDetailPageProps) {
  const { id } = await params;
  const reminder = await getRepositories().reminders.getById(id);
  if (!reminder) notFound();

  return (
    <ModulePlaceholder
      title={reminder.title}
      description="Detailansicht wird in Step 7 implementiert."
    />
  );
}
