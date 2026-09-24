"use client";

import { homeCategories } from "@/lib/domain/enums";
import type { HomeItem } from "@/lib/domain/types/home-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { labelFromEnum } from "@/lib/utils/format";

type HomeItemFormProps = {
  item?: HomeItem;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel?: string;
};

export function HomeItemForm({ item, action, submitLabel = "Save" }: HomeItemFormProps) {
  return (
    <form action={action} className="mx-auto max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={item?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            defaultValue={item?.category ?? "appliances"}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {homeCategories.map((c) => (
              <option key={c} value={c}>
                {labelFromEnum(c)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={item?.location ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <Input id="manufacturer" name="manufacturer" defaultValue={item?.manufacturer ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" name="model" defaultValue={item?.model ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serialNumber">Serial number</Label>
          <Input id="serialNumber" name="serialNumber" defaultValue={item?.serialNumber ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase date</Label>
          <Input id="purchaseDate" name="purchaseDate" type="date" defaultValue={item?.purchaseDate ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="installationDate">Installation date</Label>
          <Input
            id="installationDate"
            name="installationDate"
            type="date"
            defaultValue={item?.installationDate ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Purchase price</Label>
          <Input
            id="purchasePrice"
            name="purchasePrice"
            type="number"
            step="0.01"
            defaultValue={item?.purchasePrice ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" name="currency" defaultValue={item?.currency ?? "EUR"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="warrantyEndsAt">Warranty ends</Label>
          <Input
            id="warrantyEndsAt"
            name="warrantyEndsAt"
            type="date"
            defaultValue={item?.warrantyEndsAt ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastMaintenanceAt">Last maintenance</Label>
          <Input
            id="lastMaintenanceAt"
            name="lastMaintenanceAt"
            type="date"
            defaultValue={item?.lastMaintenanceAt ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nextMaintenanceAt">Next maintenance</Label>
          <Input
            id="nextMaintenanceAt"
            name="nextMaintenanceAt"
            type="date"
            defaultValue={item?.nextMaintenanceAt ?? ""}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" rows={4} defaultValue={item?.notes ?? ""} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
