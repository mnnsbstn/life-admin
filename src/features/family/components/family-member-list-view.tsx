import { CategoryBadge } from "@/components/domain/category-badge";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityListCard } from "@/components/domain/entity-list-card";
import { ListPageHeader } from "@/components/shell/list-page-header";
import { familyRelationshipLabels } from "@/config/family-relationships";
import {
  getFamilyMemberListMeta,
  getFamilyMemberSubtitle,
} from "@/lib/domain/family-member-meta";
import type { FamilyMember } from "@/lib/domain/types";
import { Users } from "lucide-react";

interface FamilyMemberListViewProps {
  items: FamilyMember[];
}

export function FamilyMemberListView({ items }: FamilyMemberListViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <ListPageHeader
        title="Familie"
        description="Kontakte im Haushalt — ohne App-Zugang."
        addHref="/family/new"
        addLabel="Kontakt"
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Noch keine Kontakte"
          description="Lege Partner, Kinder oder andere nahestehende Personen an."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((member) => (
            <li key={member.id}>
              <EntityListCard
                href={`/family/${member.id}`}
                title={member.name}
                subtitle={getFamilyMemberSubtitle(member)}
                meta={getFamilyMemberListMeta(member)}
                badges={
                  <CategoryBadge
                    label={familyRelationshipLabels[member.relationship]}
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
