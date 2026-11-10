"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { switchActiveHouseholdAction } from "@/lib/actions/household";
import type { Household } from "@/lib/domain/types";

interface HouseholdSwitcherProps {
  households: Household[];
  activeHouseholdId: string;
}

export function HouseholdSwitcher({
  households,
  activeHouseholdId,
}: HouseholdSwitcherProps) {
  const [pending, startTransition] = useTransition();

  if (households.length < 2) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Aktiver Haushalt</p>
      <p className="text-xs text-muted-foreground">
        Daten in Today, Home, Verträge und allen Modulen beziehen sich auf
        diese Auswahl.
      </p>
      <Select
        value={activeHouseholdId}
        disabled={pending}
        onValueChange={(nextId) => {
          if (nextId === activeHouseholdId) return;
          startTransition(async () => {
            try {
              await switchActiveHouseholdAction(nextId);
            } catch {
              toast.error("Haushalt konnte nicht gewechselt werden.");
            }
          });
        }}
      >
        <SelectTrigger
          className="w-full max-w-md"
          aria-label="Aktiver Haushalt"
        >
          <SelectValue placeholder="Haushalt wählen" />
        </SelectTrigger>
        <SelectContent>
          {households.map((h) => (
            <SelectItem key={h.id} value={h.id}>
              {h.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
