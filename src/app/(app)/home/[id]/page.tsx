import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomeDetailView } from "@/features/home/components/home-detail-view";
import {
  documentsForHomeItem,
  remindersForHomeItem,
} from "@/lib/data/resolve-links";
import { getHouseholdContextData } from "@/lib/data/household-data";
import { getRepositories } from "@/lib/repositories";

interface HomeItemDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: HomeItemDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getRepositories().homeItems.getById(id);
  return { title: item?.name ?? "Home Item" };
}

export default async function HomeItemDetailPage({
  params,
}: HomeItemDetailPageProps) {
  const { id } = await params;
  const item = await getRepositories().homeItems.getById(id);
  if (!item) notFound();

  const { documents, reminders } = await getHouseholdContextData();

  return (
    <HomeDetailView
      item={item}
      documents={documentsForHomeItem(documents, id)}
      reminders={remindersForHomeItem(reminders, id)}
    />
  );
}
