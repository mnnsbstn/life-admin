import { CategoryBadge } from "@/components/domain/category-badge";
import {
  DetailField,
  DetailFieldList,
  DetailSection,
} from "@/components/domain/detail-section";
import { DeleteEntityButton } from "@/components/domain/delete-entity-button";
import { EntityHeader } from "@/components/domain/entity-header";
import { deleteFinancialAccountAction } from "@/lib/actions/money-accounts";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";
import { financialAccountTypeLabels } from "@/config/financial-account-types";
import type { FinancialAccount } from "@/lib/domain/types";

interface FinancialAccountDetailViewProps {
  account: FinancialAccount;
}

export function FinancialAccountDetailView({
  account,
}: FinancialAccountDetailViewProps) {
  const readOnly = isGitHubPagesPreview();

  return (
    <div className="flex flex-col gap-8">
      <EntityHeader
        backHref="/money"
        backLabel="Finanzen"
        title={account.name}
        description={account.institution}
        badges={
          <CategoryBadge
            label={financialAccountTypeLabels[account.accountType]}
          />
        }
        editHref={readOnly ? undefined : `/money/${account.id}/edit`}
        actions={
          readOnly ? undefined : (
            <DeleteEntityButton
              title="Konto löschen?"
              description="Das Konto wird dauerhaft aus der Übersicht entfernt."
              deleteAction={deleteFinancialAccountAction.bind(null, account.id)}
            />
          )
        }
      />

      <DetailSection title="Konto">
        <DetailFieldList>
          <DetailField label="Institut" value={account.institution} />
          <DetailField
            label="IBAN (Endziffern)"
            value={account.ibanLast4 ? `··· ${account.ibanLast4}` : undefined}
          />
        </DetailFieldList>
      </DetailSection>

      {account.notes ? (
        <DetailSection title="Notizen">
          <p className="text-sm leading-relaxed text-foreground">{account.notes}</p>
        </DetailSection>
      ) : null}
    </div>
  );
}
