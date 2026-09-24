"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  completeReminder,
  reopenReminder,
} from "@/lib/actions/reminders";
import type { Reminder } from "@/lib/domain/types";

interface ReminderStatusActionsProps {
  reminder: Reminder;
}

export function ReminderStatusActions({ reminder }: ReminderStatusActionsProps) {
  const [pending, startTransition] = useTransition();

  if (reminder.status === "completed") {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await reopenReminder(reminder.id);
          })
        }
      >
        Wieder öffnen
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await completeReminder(reminder.id);
        })
      }
    >
      Als erledigt markieren
    </Button>
  );
}
