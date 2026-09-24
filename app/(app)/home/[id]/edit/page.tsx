import { notFound } from "next/navigation";
import { HomeItemForm } from "@/components/home/home-item-form";
import { updateHomeItemAction } from "@/lib/actions/home-items";
import { getDemoContext } from "@/lib/data/demo-context";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditHomeItemPage({ params }: PageProps) {
  const { id } = await params;
  const { repos, householdId } = getDemoContext();
  const item = repos.homeItems.getById(id);
  if (!item || item.householdId !== householdId) notFound();

  const boundAction = updateHomeItemAction.bind(null, id);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Update details for {item.name}.</p>
      <HomeItemForm item={item} action={boundAction} submitLabel="Save changes" />
    </div>
  );
}
