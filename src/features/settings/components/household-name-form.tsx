"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateHouseholdNameAction } from "@/lib/actions/household";

interface HouseholdNameFormProps {
  defaultName: string;
  disabled?: boolean;
}

export function HouseholdNameForm({
  defaultName,
  disabled,
}: HouseholdNameFormProps) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
      action={(formData) => {
        startTransition(async () => {
          try {
            await updateHouseholdNameAction(formData);
            toast.success("Haushaltsname gespeichert.");
          } catch {
            toast.error("Speichern fehlgeschlagen.");
          }
        });
      }}
    >
      <div className="grid flex-1 gap-2">
        <Label htmlFor="household-name">Name</Label>
        <Input
          id="household-name"
          name="name"
          defaultValue={defaultName}
          disabled={disabled || pending}
          maxLength={120}
          required
        />
      </div>
      <Button type="submit" disabled={disabled || pending}>
        {pending ? "Speichern…" : "Speichern"}
      </Button>
    </form>
  );
}
