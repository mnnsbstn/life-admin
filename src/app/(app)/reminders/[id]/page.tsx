import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ReminderDetailView } from "@/features/reminders/components/reminder-detail-view";
import { resolveReminderLink } from "@/lib/data/resolve-links";
import { getHouseholdContextData } from "@/lib/data/household-data";
import { getRepositories } from "@/lib/repositories";
import { staticReminderParams } from "@/lib/static-export-params";
import { staticIdParams } from "@/lib/static-generate-params";

export function generateStaticParams() {
  return staticIdParams(staticReminderParams());
}

interface ReminderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ReminderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const reminder = await getRepositories().reminders.getById(id);
  return { title: reminder?.title ?? "Erinnerung" };
}

export default async function ReminderDetailPage({
  params,
}: ReminderDetailPageProps) {
  const { id } = await params;
  const reminder = await getRepositories().reminders.getById(id);
  if (!reminder) notFound();

  const { homeItems, contracts } = await getHouseholdContextData();
  const link = resolveReminderLink(reminder.link, homeItems, contracts);

  return <ReminderDetailView reminder={reminder} link={link} />;
}
