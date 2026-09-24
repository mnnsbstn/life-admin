import { CategoryBadge } from "@/components/domain/category-badge";
import {
  DetailField,
  DetailFieldList,
  DetailSection,
} from "@/components/domain/detail-section";
import { EntityHeader } from "@/components/domain/entity-header";
import { LinkedItemsList } from "@/components/domain/linked-items-list";
import { contractCategoryLabels } from "@/config/categories";
import { paymentIntervalLabels } from "@/config/payment-intervals";
import { documentTypeLabels } from "@/config/document-types";
import {
  getContractCostLabel,
  getContractListMeta,
} from "@/lib/domain/contract-meta";
import type { Contract, Document, Reminder } from "@/lib/domain/types";
import { withDerivedReminderStatus } from "@/lib/domain/reminder-status";
import { formatDisplayDate } from "@/lib/format/date";

interface ContractDetailViewProps {
  contract: Contract;
  documents: Document[];
  reminders: Reminder[];
}

export function ContractDetailView({
  contract,
  documents,
  reminders,
}: ContractDetailViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <EntityHeader
        backHref="/contracts"
        title={contract.name}
        description={contract.provider}
        badges={
          <CategoryBadge label={contractCategoryLabels[contract.category]} />
        }
        editHref={`/contracts/${contract.id}/edit`}
      />

      {getContractListMeta(contract) ? (
        <p className="-mt-4 text-sm text-muted-foreground">
          {getContractListMeta(contract)}
        </p>
      ) : null}

      <DetailSection title="Vertrag">
        <DetailFieldList>
          <DetailField label="Kosten" value={getContractCostLabel(contract)} />
          <DetailField
            label="Intervall"
            value={
              contract.paymentInterval
                ? paymentIntervalLabels[contract.paymentInterval]
                : undefined
            }
          />
          <DetailField
            label="Beginn"
            value={
              contract.startDate
                ? formatDisplayDate(contract.startDate)
                : undefined
            }
          />
          <DetailField
            label="Mindestlaufzeit"
            value={
              contract.minimumTermMonths != null
                ? `${contract.minimumTermMonths} Monate`
                : undefined
            }
          />
          <DetailField
            label="Kündigungsfrist"
            value={
              contract.noticePeriodDays != null
                ? `${contract.noticePeriodDays} Tage`
                : undefined
            }
          />
          <DetailField
            label="Kündigung ab"
            value={
              contract.nextCancellationDate
                ? formatDisplayDate(contract.nextCancellationDate)
                : undefined
            }
          />
          <DetailField
            label="Vertragsende"
            value={
              contract.contractEndDate
                ? formatDisplayDate(contract.contractEndDate)
                : undefined
            }
          />
          <DetailField
            label="Auto-Verlängerung"
            value={contract.autoRenewal ? "Ja" : "Nein"}
          />
        </DetailFieldList>
      </DetailSection>

      {contract.notes ? (
        <DetailSection title="Notizen">
          <p className="text-sm leading-relaxed">{contract.notes}</p>
        </DetailSection>
      ) : null}

      <DetailSection title="Dokumente">
        <LinkedItemsList
          emptyLabel="Noch keine Dokumente verknüpft."
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
