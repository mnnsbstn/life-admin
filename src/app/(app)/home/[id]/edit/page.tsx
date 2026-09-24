import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomeItemForm } from "@/features/home/components/home-item-form";
import { homeItemToFormValues } from "@/features/home/lib/map-form";
import { getRepositories } from "@/lib/repositories";

interface EditHomeItemPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditHomeItemPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getRepositories().homeItems.getById(id);
  return { title: item ? `${item.name} bearbeiten` : "Bearbeiten" };
}

export default async function EditHomeItemPage({ params }: EditHomeItemPageProps) {
  const { id } = await params;
  const item = await getRepositories().homeItems.getById(id);
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Home Item bearbeiten</h1>
      <HomeItemForm defaultValues={homeItemToFormValues(item)} itemId={id} />
    </div>
  );
}
