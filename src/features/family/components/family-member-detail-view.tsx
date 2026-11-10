import { CategoryBadge } from "@/components/domain/category-badge";
import {
  DetailField,
  DetailFieldList,
  DetailSection,
} from "@/components/domain/detail-section";
import { DeleteEntityButton } from "@/components/domain/delete-entity-button";
import { EntityHeader } from "@/components/domain/entity-header";
import { deleteFamilyMemberAction } from "@/lib/actions/family-members";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";
import { familyRelationshipLabels } from "@/config/family-relationships";
import type { FamilyMember } from "@/lib/domain/types";
import { formatDisplayDate } from "@/lib/format/date";

interface FamilyMemberDetailViewProps {
  member: FamilyMember;
}

export function FamilyMemberDetailView({ member }: FamilyMemberDetailViewProps) {
  const readOnly = isGitHubPagesPreview();

  return (
    <div className="flex flex-col gap-8">
      <EntityHeader
        backHref="/family"
        backLabel="Familie"
        title={member.name}
        description={familyRelationshipLabels[member.relationship]}
        badges={
          <CategoryBadge label={familyRelationshipLabels[member.relationship]} />
        }
        editHref={readOnly ? undefined : `/family/${member.id}/edit`}
        actions={
          readOnly ? undefined : (
            <DeleteEntityButton
              title="Kontakt löschen?"
              description="Der Kontakt wird dauerhaft aus der Familienliste entfernt."
              deleteAction={deleteFamilyMemberAction.bind(null, member.id)}
            />
          )
        }
      />

      <DetailSection title="Kontakt">
        <DetailFieldList>
          <DetailField label="E-Mail" value={member.email} />
          <DetailField label="Telefon" value={member.phone} />
          <DetailField
            label="Geburtstag"
            value={
              member.birthday ? formatDisplayDate(member.birthday) : undefined
            }
          />
        </DetailFieldList>
      </DetailSection>

      {member.notes ? (
        <DetailSection title="Notizen">
          <p className="text-sm leading-relaxed text-foreground">{member.notes}</p>
        </DetailSection>
      ) : null}
    </div>
  );
}
