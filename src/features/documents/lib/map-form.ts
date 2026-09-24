import type { DocumentFormValues } from "@/features/documents/schemas/document.schema";
import type { Document } from "@/lib/domain/types";

export function documentToFormValues(document: Document): DocumentFormValues {
  return {
    title: document.title,
    documentType: document.documentType,
    issuedAt: document.issuedAt ?? "",
    mockFileName: document.mockFileName ?? "",
    linkType:
      document.link.type === "home_item"
        ? "home_item"
        : document.link.type === "contract"
          ? "contract"
          : "none",
    linkTargetId:
      document.link.type === "none" ? "" : document.link.id,
    notes: document.notes ?? "",
  };
}

export const emptyDocumentFormValues: DocumentFormValues = {
  title: "",
  documentType: "other",
  issuedAt: "",
  mockFileName: "",
  linkType: "none",
  linkTargetId: "",
  notes: "",
};
