import Link from "next/link";

import {
  DetailField,
  DetailFieldList,
  DetailSection,
} from "@/components/domain/detail-section";
import { DeleteEntityButton } from "@/components/domain/delete-entity-button";
import { EntityHeader } from "@/components/domain/entity-header";
import { deleteReminderAction } from "@/lib/actions/reminders";
import { PriorityBadge } from "@/components/domain/priority-badge";
import { ReminderStatusBadge } from "@/components/domain/reminder-status-badge";
import { ReminderStatusActions } from "@/features/reminders/components/reminder-status-actions";
import type { Reminder } from "@/lib/domain/types";
import type { ResolvedLink } from "@/lib/data/resolve-links";
import { withDerivedReminderStatus } from "@/lib/domain/reminder-status";
import { formatDisplayDate } from "@/lib/format/date";

interface ReminderDetailViewProps {
  reminder: Reminder;
  link: ResolvedLink;
}

export function ReminderDetailView({ reminder, link }: ReminderDetailViewProps) {
  const enriched = withDerivedReminderStatus(reminder);

  return (
    <div className="flex flex-col gap-8">
      <EntityHeader
        backHref="/reminders"
        title={reminder.title}
        badges={
          <>
            <ReminderStatusBadge status={enriched.status} />
            <PriorityBadge priority={reminder.priority} />
          </>
        }
        editHref={`/reminders/${reminder.id}/edit`}
        actions={
          <>
            <ReminderStatusActions reminder={enriched} />
            <DeleteEntityButton
              title="Erinnerung löschen?"
              description="Die Erinnerung wird dauerhaft entfernt."
              deleteAction={deleteReminderAction.bind(null, reminder.id)}
            />
          </>
        }
      />

      <DetailSection title="Details">
        <DetailFieldList>
          <DetailField
            label="Fällig am"
            value={formatDisplayDate(reminder.dueDate)}
          />
          <DetailField
            label="Bezug"
            value={
              link.href ? (
                <Link href={link.href} className="underline-offset-4 hover:underline">
                  {link.label}
                </Link>
              ) : (
                link.label
              )
            }
          />
        </DetailFieldList>
      </DetailSection>

      {reminder.notes ? (
        <DetailSection title="Notiz">
          <p className="text-sm leading-relaxed">{reminder.notes}</p>
        </DetailSection>
      ) : null}
    </div>
  );
}
