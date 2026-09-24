import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ModulePlaceholder } from "@/components/shell/module-placeholder";
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

  return (
    <ModulePlaceholder
      title={item.name}
      description="Detailansicht wird in Step 7 implementiert."
    />
  );
}
