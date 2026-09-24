"use client";

import { documentTypes } from "@/lib/domain/enums";
import type { Document } from "@/lib/domain/types/document";
import type { Contract } from "@/lib/domain/types/contract";
import type { HomeItem } from "@/lib/domain/types/home-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { labelFromEnum } from "@/lib/utils/format";

type DocumentFormProps = {
  document?: Document;
  homeItems: HomeItem[];
  contracts: Contract[];
  action: (formData: FormData) => void | Promise<void>;
  submitLabel?: string;
};

export function DocumentForm({
  document,
  homeItems,
  contracts,
  action,
  submitLabel = "Save",
}: DocumentFormProps) {
  return (
    <form action={action} className="mx-auto max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={document?.title} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            name="type"
            defaultValue={document?.type ?? "other"}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
          >
            {documentTypes.map((t) => (
              <option key={t} value={t}>
                {labelFromEnum(t)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="issuedAt">Issued date</Label>
          <Input id="issuedAt" name="issuedAt" type="date" defaultValue={document?.issuedAt ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="homeItemId">Linked home item</Label>
          <select
            id="homeItemId"
            name="homeItemId"
            defaultValue={document?.homeItemId ?? ""}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
          >
            <option value="">None</option>
            {homeItems.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="contractId">Linked contract</Label>
          <select
            id="contractId"
            name="contractId"
            defaultValue={document?.contractId ?? ""}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
          >
            <option value="">None</option>
            {contracts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fileName">File name (mock)</Label>
          <Input id="fileName" name="fileName" defaultValue={document?.fileName ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mimeType">MIME type</Label>
          <Input id="mimeType" name="mimeType" defaultValue={document?.mimeType ?? "application/pdf"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sizeBytes">Size (bytes)</Label>
          <Input id="sizeBytes" name="sizeBytes" type="number" defaultValue={document?.sizeBytes ?? ""} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" rows={3} defaultValue={document?.notes ?? ""} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
