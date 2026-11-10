import type { CalendarEventInput } from "@/lib/calendar/types";
import type { Contract, Reminder } from "@/lib/domain/types";
import { resolveNextCancellationDate } from "@/lib/domain/contract-dates";
import { formatDisplayDate } from "@/lib/format/date";
import type { ShareEmailInput } from "@/lib/email/share-links";

export function reminderCalendarEvent(reminder: Reminder): CalendarEventInput {
  const description = [reminder.notes].filter(Boolean).join("\n");
  return {
    title: reminder.title,
    date: reminder.dueDate,
    description: description || undefined,
  };
}

export function reminderShareEmail(reminder: Reminder): ShareEmailInput {
  return {
    subject: `Erinnerung: ${reminder.title}`,
    bodyLines: [
      `Fällig: ${formatDisplayDate(reminder.dueDate)}`,
      reminder.notes ? `Notiz: ${reminder.notes}` : "",
      "",
      "— Life Admin",
    ],
  };
}

export interface ContractCalendarExport {
  id: string;
  label: string;
  event: CalendarEventInput;
}

export function contractCalendarExports(
  contract: Contract,
): ContractCalendarExport[] {
  const exports: ContractCalendarExport[] = [];
  const cancellation = resolveNextCancellationDate(contract);
  if (cancellation) {
    exports.push({
      id: "cancellation",
      label: "Kündigung",
      event: {
        title: `${contract.name} — Kündigung möglich`,
        date: cancellation,
        description: contract.provider
          ? `Anbieter: ${contract.provider}`
          : undefined,
      },
    });
  }
  if (contract.contractEndDate) {
    exports.push({
      id: "end",
      label: "Vertragsende",
      event: {
        title: `${contract.name} — Vertragsende`,
        date: contract.contractEndDate,
        description: contract.provider
          ? `Anbieter: ${contract.provider}`
          : undefined,
      },
    });
  }
  return exports;
}

export function contractShareEmail(contract: Contract): ShareEmailInput {
  const cancellation = resolveNextCancellationDate(contract);
  const lines = [
    contract.provider ? `Anbieter: ${contract.provider}` : "",
    cancellation
      ? `Kündigung ab: ${formatDisplayDate(cancellation)}`
      : "",
    contract.contractEndDate
      ? `Vertragsende: ${formatDisplayDate(contract.contractEndDate)}`
      : "",
    "",
    "— Life Admin",
  ];
  return {
    subject: `Vertrag: ${contract.name}`,
    bodyLines: lines,
  };
}
