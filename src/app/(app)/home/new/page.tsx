import type { Metadata } from "next";

import { HomeItemForm } from "@/features/home/components/home-item-form";
import { emptyHomeItemFormValues } from "@/features/home/lib/map-form";

export const metadata: Metadata = {
  title: "Home Item anlegen",
};

export default function NewHomeItemPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Home Item anlegen</h1>
      <HomeItemForm defaultValues={emptyHomeItemFormValues} />
    </div>
  );
}
