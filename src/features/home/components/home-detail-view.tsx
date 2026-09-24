import { CategoryBadge } from "@/components/domain/category-badge";
import {
  DetailField,
  DetailFieldList,
  DetailSection,
} from "@/components/domain/detail-section";
import { EntityHeader } from "@/components/domain/entity-header";
import { LinkedItemsList } from "@/components/domain/linked-items-list";
import { homeItemCategoryLabels } from "@/config/categories";
import { documentTypeLabels } from "@/config/document-types";
import type { Document, HomeItem, Reminder } from "@/lib/domain/types";
import { withDerivedReminderStatus } from "@/lib/domain/reminder-status";
import { formatDisplayDate } from "@/lib/format/date";
import { formatEuroFromCents } from "@/lib/format/currency";

interface HomeDetailViewProps {
  item: HomeItem;
  documents: Document[];
  reminders: Reminder[];
}

export function HomeDetailView({
  item,
  documents,
  reminders,
}: HomeDetailViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <EntityHeader
        backHref="/home"
        backLabel="Home"
        title={item.name}
        description={[item.manufacturer, item.model].filter(Boolean).join(" · ")}
        badges={
          <CategoryBadge label={homeItemCategoryLabels[item.category]} />
        }
        editHref={`/home/${item.id}/edit`}
      />

      <DetailSection title="Stammdaten">
        <DetailFieldList>
          <DetailField label="Standort" value={item.location} />
          <DetailField label="Seriennummer" value={item.serialNumber} />
          <DetailField
            label="Kaufpreis"
            value={
              item.purchasePriceCents != null
                ? formatEuroFromCents(item.purchasePriceCents)
                : undefined
            }
          />
          <DetailField
            label="Kaufdatum"
            value={item.purchaseDate ? formatDisplayDate(item.purchaseDate) : undefined}
          />
          <DetailField
            label="Installation"
            value={
              item.installationDate
                ? formatDisplayDate(item.installationDate)
                : undefined
            }
          />
        </DetailFieldList>
      </DetailSection>

      <DetailSection title="Termine">
        <DetailFieldList>
          <DetailField
            label="Garantie bis"
            value={
              item.warrantyEndsAt
                ? formatDisplayDate(item.warrantyEndsAt)
                : undefined
            }
          />
          <DetailField
            label="Letzte Wartung"
            value={
              item.lastMaintenanceAt
                ? formatDisplayDate(item.lastMaintenanceAt)
                : undefined
            }
          />
          <DetailField
            label="Nächste Wartung"
            value={
              item.nextMaintenanceAt
                ? formatDisplayDate(item.nextMaintenanceAt)
                : undefined
            }
          />
        </DetailFieldList>
      </DetailSection>

      {item.notes ? (
        <DetailSection title="Notizen">
          <p className="text-sm leading-relaxed text-foreground">{item.notes}</p>
        </DetailSection>
      ) : null}

      <DetailSection title="Dokumente">
        <LinkedItemsList
          emptyLabel="Noch keine verknüpften Dokumente."
          items={documents.map((doc) => ({
            id: doc.id,
            title: doc.title,
            subtitle: documentTypeLabels[doc.documentType],
            href: `/documents/${doc.id}`,
          }))}
        />
      </DetailSection>

      <DetailSection title="Erinnerungen">
        <LinkedItemsList
          emptyLabel="Keine Erinnerungen verknüpft."
          items={reminders.map((reminder) => {
            const enriched = withDerivedReminderStatus(reminder);
            return {
              id: reminder.id,
              title: reminder.title,
              subtitle: `Fällig ${formatDisplayDate(reminder.dueDate)} · ${enriched.status}`,
              href: `/reminders/${reminder.id}`,
            };
          })}
        />
      </DetailSection>
    </div>
  );
}
