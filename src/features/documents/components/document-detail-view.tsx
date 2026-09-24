import Link from "next/link";

import { CategoryBadge } from "@/components/domain/category-badge";
import {
  DetailField,
  DetailFieldList,
  DetailSection,
} from "@/components/domain/detail-section";
import { EntityHeader } from "@/components/domain/entity-header";
import { documentTypeLabels } from "@/config/document-types";
import type { Document } from "@/lib/domain/types";
import type { ResolvedLink } from "@/lib/data/resolve-links";
import { formatDisplayDate } from "@/lib/format/date";
import { formatFileSize } from "@/lib/format/file-size";
import { Button } from "@/components/ui/button";

interface DocumentDetailViewProps {
  document: Document;
  link: ResolvedLink;
  /** When set, user can download the stored file (Supabase Storage). */
  downloadHref?: string;
}

export function DocumentDetailView({
  document,
  link,
  downloadHref,
}: DocumentDetailViewProps) {
  const hasStoredFile = Boolean(downloadHref);
  return (
    <div className="flex flex-col gap-8">
      <EntityHeader
        backHref="/documents"
        title={document.title}
        badges={
          <CategoryBadge label={documentTypeLabels[document.documentType]} />
        }
        editHref={`/documents/${document.id}/edit`}
      />

      <DetailSection title="Metadaten">
        <DetailFieldList>
          <DetailField
            label="Ausgestellt"
            value={
              document.issuedAt
                ? formatDisplayDate(document.issuedAt)
                : undefined
            }
          />
          <DetailField
            label="Verknüpfung"
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

      <DetailSection title={hasStoredFile ? "Datei" : "Datei (Demo)"}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">{document.mockFileName ?? "—"}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(document.mockFileSizeBytes)}
              {hasStoredFile
                ? document.mimeType
                  ? ` · ${document.mimeType}`
                  : ""
                : " · Upload nur im Supabase-Modus"}
            </p>
          </div>
          {hasStoredFile ? (
            <Button variant="outline" size="sm" asChild>
              <a href={downloadHref} target="_blank" rel="noopener noreferrer">
                Download
              </a>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Download
            </Button>
          )}
        </div>
      </DetailSection>

      {document.notes ? (
        <DetailSection title="Notizen">
          <p className="text-sm leading-relaxed">{document.notes}</p>
        </DetailSection>
      ) : null}
    </div>
  );
}
