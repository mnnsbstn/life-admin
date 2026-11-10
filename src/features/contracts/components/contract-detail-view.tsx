import { CategoryBadge } from "@/components/domain/category-badge";
import {
  DetailField,
  DetailFieldList,
  DetailSection,
} from "@/components/domain/detail-section";
import { DeleteEntityButton } from "@/components/domain/delete-entity-button";
import { EntityHeader } from "@/components/domain/entity-header";
import { deleteContractAction } from "@/lib/actions/contracts";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";
import { LinkedItemsList } from "@/components/domain/linked-items-list";
import { contractCategoryLabels } from "@/config/categories";
import { paymentIntervalLabels } from "@/config/payment-intervals";
import { documentTypeLabels } from "@/config/document-types";
import { resolveNextCancellationDate } from "@/lib/domain/contract-dates";
import {
  getContractCostLabel,
  getContractListMeta,
} from "@/lib/domain/contract-meta";
import type { Contract, Document, Reminder } from "@/lib/domain/types";
import { withDerivedReminderStatus } from "@/lib/domain/reminder-status";
import { CalendarExportActions } from "@/components/domain/calendar-export-actions";
import {
  contractCalendarExports,
  contractShareEmail,
} from "@/lib/calendar/event-builders";
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
  const readOnly = isGitHubPagesPreview();

  return (
    <div className="flex flex-col gap-8">
      <EntityHeader
        backHref="/contracts"
        title={contract.name}
        description={contract.provider}
        badges={
          <CategoryBadge label={contractCategoryLabels[contract.category]} />
        }
        editHref={readOnly ? undefined : `/contracts/${contract.id}/edit`}
        actions={
          readOnly ? undefined : (
            <DeleteEntityButton
              title="Vertrag löschen?"
              description="Der Vertrag wird dauerhaft entfernt. Verknüpfte Dokumente bleiben bestehen."
              deleteAction={deleteContractAction.bind(null, contract.id)}
            />
          )
        }
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
            value={(() => {
              const date = resolveNextCancellationDate(contract);
              return date ? formatDisplayDate(date) : undefined;
            })()}
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

      <DetailSection title="Kalender & E-Mail">
        {(() => {
          const exports = contractCalendarExports(contract);
          return exports.length > 0 ? (
            <ul className="space-y-4">
              {exports.map((item) => (
                <li key={item.id} className="space-y-2">
                  <p className="text-sm font-medium">{item.label}</p>
                  <CalendarExportActions
                    compact
                    event={item.event}
                    icsFileName={`vertrag-${contract.id}-${item.id}`}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Keine Kündigungs- oder Enddaten für Kalenderexport hinterlegt.
            </p>
          );
        })()}
        <div className="mt-4">
          <p className="mb-2 text-sm text-muted-foreground">
            Inhalt per E-Mail teilen oder in der Inbox-App kopieren — zum Erfassen
            auch{" "}
            <a href="/capture" className="underline underline-offset-2">
              Smart Capture
            </a>
            .
          </p>
          <CalendarExportActions
            compact
            email={contractShareEmail(contract)}
          />
        </div>
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
