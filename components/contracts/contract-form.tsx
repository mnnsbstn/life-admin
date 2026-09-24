"use client";

import { contractCategories, costIntervals } from "@/lib/domain/enums";
import type { Contract } from "@/lib/domain/types/contract";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { labelFromEnum } from "@/lib/utils/format";

type ContractFormProps = {
  contract?: Contract;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel?: string;
};

export function ContractForm({ contract, action, submitLabel = "Save" }: ContractFormProps) {
  return (
    <form action={action} className="mx-auto max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={contract?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="provider">Provider</Label>
          <Input id="provider" name="provider" defaultValue={contract?.provider} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            defaultValue={contract?.category ?? "other"}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {contractCategories.map((c) => (
              <option key={c} value={c}>
                {labelFromEnum(c)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost">Cost</Label>
          <Input id="cost" name="cost" type="number" step="0.01" defaultValue={contract?.cost ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="costInterval">Billing interval</Label>
          <select
            id="costInterval"
            name="costInterval"
            defaultValue={contract?.costInterval ?? "monthly"}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
          >
            {costIntervals.map((c) => (
              <option key={c} value={c}>
                {labelFromEnum(c)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDate">Start date</Label>
          <Input id="startDate" name="startDate" type="date" defaultValue={contract?.startDate ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minimumTermMonths">Minimum term (months)</Label>
          <Input
            id="minimumTermMonths"
            name="minimumTermMonths"
            type="number"
            defaultValue={contract?.minimumTermMonths ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="noticePeriodDays">Notice period (days)</Label>
          <Input
            id="noticePeriodDays"
            name="noticePeriodDays"
            type="number"
            defaultValue={contract?.noticePeriodDays ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="renewalPeriodMonths">Renewal period (months)</Label>
          <Input
            id="renewalPeriodMonths"
            name="renewalPeriodMonths"
            type="number"
            defaultValue={contract?.renewalPeriodMonths ?? ""}
          />
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            id="autoRenewal"
            name="autoRenewal"
            type="checkbox"
            defaultChecked={contract?.autoRenewal ?? false}
            className="size-4 rounded border border-input accent-primary"
          />
          <Label htmlFor="autoRenewal">Auto-renewal</Label>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" rows={4} defaultValue={contract?.notes ?? ""} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
