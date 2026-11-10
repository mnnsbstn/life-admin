"use client";

import { ReminderForm } from "@/features/reminders/components/reminder-form";
import type { ReminderFormValues } from "@/features/reminders/schemas/reminder.schema";
import { useSmartCapturePrefill } from "@/lib/smart-capture/use-smart-capture-prefill";
import { SMART_CAPTURE_SESSION_KEYS } from "@/lib/smart-capture/types";
import type { Contract, HomeItem } from "@/lib/domain/types";

interface ReminderFormNewClientProps {
  defaultValues: ReminderFormValues;
  homeItems: HomeItem[];
  contracts: Contract[];
}

export function ReminderFormNewClient(props: ReminderFormNewClientProps) {
  const { values, ready } = useSmartCapturePrefill(
    SMART_CAPTURE_SESSION_KEYS.reminder,
    props.defaultValues,
  );

  if (!ready) return null;

  return (
    <ReminderForm
      defaultValues={values}
      homeItems={props.homeItems}
      contracts={props.contracts}
    />
  );
}
