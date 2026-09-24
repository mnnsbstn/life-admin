"use client";

import { reminderPriorities, reminderStatuses } from "@/lib/domain/enums";
import type { Reminder } from "@/lib/domain/types/reminder";
import type { Contract } from "@/lib/domain/types/contract";
import type { HomeItem } from "@/lib/domain/types/home-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { labelFromEnum } from "@/lib/utils/format";

type ReminderFormProps = {
  reminder?: Reminder;
  homeItems: HomeItem[];
  contracts: Contract[];
  action: (formData: FormData) => void | Promise<void>;
  submitLabel?: string;
};

export function ReminderForm({
  reminder,
  homeItems,
  contracts,
  action,
  submitLabel = "Save",
}: ReminderFormProps) {
  return (
    <form action={action} className="mx-auto max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={reminder?.title} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due date</Label>
          <Input id="dueDate" name="dueDate" type="date" defaultValue={reminder?.dueDate} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <select
            id="priority"
            name="priority"
            defaultValue={reminder?.priority ?? "medium"}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
          >
            {reminderPriorities.map((p) => (
              <option key={p} value={p}>
                {labelFromEnum(p)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={reminder?.status ?? "upcoming"}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
          >
            {reminderStatuses.map((s) => (
              <option key={s} value={s}>
                {labelFromEnum(s)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="homeItemId">Linked home item</Label>
          <select
            id="homeItemId"
            name="homeItemId"
            defaultValue={reminder?.homeItemId ?? ""}
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
            defaultValue={reminder?.contractId ?? ""}
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
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" rows={3} defaultValue={reminder?.notes ?? ""} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
