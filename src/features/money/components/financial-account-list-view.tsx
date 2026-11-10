import { CategoryBadge } from "@/components/domain/category-badge";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityListCard } from "@/components/domain/entity-list-card";
import { ListPageHeader } from "@/components/shell/list-page-header";
import { financialAccountTypeLabels } from "@/config/financial-account-types";
import {
  getFinancialAccountListMeta,
  getFinancialAccountSubtitle,
} from "@/lib/domain/financial-account-meta";
import type { FinancialAccount } from "@/lib/domain/types";
import { Wallet } from "lucide-react";

interface FinancialAccountListViewProps {
  items: FinancialAccount[];
}

export function FinancialAccountListView({ items }: FinancialAccountListViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <ListPageHeader
        title="Finanzen"
        description="Konten und Depots deines Haushalts — ohne API-Anbindung."
        addHref="/money/new"
        addLabel="Konto"
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Noch keine Konten"
          description="Erfasse Giro-, Spar- oder andere Konten zur Übersicht."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((account) => (
            <li key={account.id}>
              <EntityListCard
                href={`/money/${account.id}`}
                title={account.name}
                subtitle={getFinancialAccountSubtitle(account)}
                meta={getFinancialAccountListMeta(account)}
                badges={
                  <CategoryBadge
                    label={financialAccountTypeLabels[account.accountType]}
                  />
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
