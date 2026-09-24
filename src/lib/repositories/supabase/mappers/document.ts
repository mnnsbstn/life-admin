import type {
  Document,
  DocumentLinkTarget,
  DocumentType,
} from "@/lib/domain/types";

export interface DocumentRow {
  id: string;
  household_id: string;
  title: string;
  document_type: DocumentType;
  issued_at: string | null;
  storage_path: string | null;
  mime_type: string | null;
  mock_file_name: string | null;
  mock_file_size_bytes: number | null;
  link_type: "none" | "home_item" | "contract";
  link_target_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

function mapLinkFromRow(row: DocumentRow): DocumentLinkTarget {
  if (row.link_type === "home_item" && row.link_target_id) {
    return { type: "home_item", id: row.link_target_id };
  }
  if (row.link_type === "contract" && row.link_target_id) {
    return { type: "contract", id: row.link_target_id };
  }
  return { type: "none" };
}

function mapLinkToRow(
  link: DocumentLinkTarget,
): Pick<DocumentRow, "link_type" | "link_target_id"> {
  if (link.type === "home_item") {
    return { link_type: "home_item", link_target_id: link.id };
  }
  if (link.type === "contract") {
    return { link_type: "contract", link_target_id: link.id };
  }
  return { link_type: "none", link_target_id: null };
}

export function mapDocumentRow(row: DocumentRow): Document {
  return {
    id: row.id,
    householdId: row.household_id,
    title: row.title,
    documentType: row.document_type,
    issuedAt: row.issued_at ?? undefined,
    storagePath: row.storage_path ?? undefined,
    mimeType: row.mime_type ?? undefined,
    mockFileName: row.mock_file_name ?? undefined,
    mockFileSizeBytes: row.mock_file_size_bytes ?? undefined,
    link: mapLinkFromRow(row),
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapDocumentToRow(
  item: Omit<Document, "id" | "createdAt" | "updatedAt">,
): Omit<DocumentRow, "id" | "created_at" | "updated_at"> {
  const linkRow = mapLinkToRow(item.link);

  return {
    household_id: item.householdId,
    title: item.title,
    document_type: item.documentType,
    issued_at: item.issuedAt ?? null,
    storage_path: item.storagePath ?? null,
    mime_type: item.mimeType ?? null,
    mock_file_name: item.mockFileName ?? null,
    mock_file_size_bytes: item.mockFileSizeBytes ?? null,
    ...linkRow,
    notes: item.notes ?? null,
  };
}
