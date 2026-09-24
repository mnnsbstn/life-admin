import { HomeItemForm } from "@/components/home/home-item-form";
import { createHomeItemAction } from "@/lib/actions/home-items";

export default function NewHomeItemPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Add an appliance, system, or device.</p>
      <HomeItemForm action={createHomeItemAction} submitLabel="Create home item" />
    </div>
  );
}
