import { CategoryBadge } from "@/components/domain/category-badge";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityListCard } from "@/components/domain/entity-list-card";
import { ListPageHeader } from "@/components/shell/list-page-header";
import { contractCategoryLabels } from "@/config/categories";
import {
  getContractCostLabel,
  getContractListMeta,
} from "@/lib/domain/contract-meta";
import type { Contract, ContractCategory } from "@/lib/domain/types";
import { FileSignature } from "lucide-react";

interface ContractListViewProps {
  items: Contract[];
  activeCategory?: ContractCategory | "all";
}

export function ContractListView({
  items,
  activeCategory = "all",
}: ContractListViewProps) {
  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((c) => c.category === activeCategory);

  const categories = [...new Set(items.map((c) => c.category))];

  return (
    <div className="flex flex-col gap-8">
      <ListPageHeader
        title="Verträge"
        description="Strom, Internet, Versicherungen und laufende Verpflichtungen."
        addHref="/contracts/new"
        addLabel="Vertrag"
      />

      {categories.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          <CategoryFilterChip
            href="/contracts"
            label="Alle"
            active={activeCategory === "all"}
          />
          {categories.map((cat) => (
            <CategoryFilterChip
              key={cat}
              href={`/contracts?category=${cat}`}
              label={contractCategoryLabels[cat]}
              active={activeCategory === cat}
            />
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileSignature}
          title="Keine Verträge"
          description="Erfasse deinen ersten Vertrag, um Fristen und Kosten im Blick zu behalten."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((contract) => (
            <li key={contract.id}>
              <EntityListCard
                href={`/contracts/${contract.id}`}
                title={contract.name}
                subtitle={contract.provider}
                meta={getContractListMeta(contract) ?? getContractCostLabel(contract)}
                badges={
                  <CategoryBadge
                    label={contractCategoryLabels[contract.category]}
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

function CategoryFilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      className={
        active
          ? "rounded-full border border-foreground/15 bg-foreground px-3 py-1 text-xs font-medium text-background"
          : "rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
      }
    >
      {label}
    </a>
  );
}
