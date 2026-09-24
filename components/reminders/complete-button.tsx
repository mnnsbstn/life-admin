"use client";

import { completeReminderAction } from "@/lib/actions/reminders";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function CompleteReminderButton({ id }: { id: string }) {
  return (
    <form action={completeReminderAction.bind(null, id)}>
      <Button type="submit" size="sm" variant="secondary">
        <Check className="mr-2 size-4" aria-hidden />
        Mark complete
      </Button>
    </form>
  );
}
