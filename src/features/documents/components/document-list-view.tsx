import { CategoryBadge } from "@/components/domain/category-badge";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityListCard } from "@/components/domain/entity-list-card";
import { ListPageHeader } from "@/components/shell/list-page-header";
import { documentTypeLabels } from "@/config/document-types";
import type { Contract, Document, HomeItem } from "@/lib/domain/types";
import { resolveDocumentLink } from "@/lib/data/resolve-links";
import { formatDisplayDate } from "@/lib/format/date";
import { formatFileSize } from "@/lib/format/file-size";
import { FileText } from "lucide-react";

interface DocumentListViewProps {
  items: Document[];
  homeItems: HomeItem[];
  contracts: Contract[];
}

export function DocumentListView({
  items,
  homeItems,
  contracts,
}: DocumentListViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <ListPageHeader
        title="Dokumente"
        description="Rechnungen, Verträge und Unterlagen — verknüpft mit deinen Objekten."
        addHref="/documents/new"
        addLabel="Dokument"
      />

      {items.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Keine Dokumente"
          description="Lege ein Dokument an und verknüpfe es mit einem Home Item oder Vertrag."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((doc) => {
            const link = resolveDocumentLink(doc.link, homeItems, contracts);
            const metaParts = [
              link.label,
              doc.issuedAt ? formatDisplayDate(doc.issuedAt) : null,
              doc.mockFileName
                ? `${doc.mockFileName} (${formatFileSize(doc.mockFileSizeBytes)})`
                : null,
            ].filter(Boolean);

            return (
              <li key={doc.id}>
                <EntityListCard
                  href={`/documents/${doc.id}`}
                  title={doc.title}
                  meta={metaParts.join(" · ")}
                  badges={
                    <CategoryBadge label={documentTypeLabels[doc.documentType]} />
                  }
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
