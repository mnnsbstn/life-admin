import type { DocumentFormValues } from "@/features/documents/schemas/document.schema";

export function documentValuesToFormData(
  values: DocumentFormValues,
  file?: File | null,
): FormData {
  const formData = new FormData();
  formData.set("title", values.title);
  formData.set("documentType", values.documentType);
  formData.set("issuedAt", values.issuedAt ?? "");
  formData.set("mockFileName", values.mockFileName ?? "");
  formData.set("linkType", values.linkType);
  formData.set("linkTargetId", values.linkTargetId ?? "");
  formData.set("notes", values.notes ?? "");
  if (file && file.size > 0) {
    formData.set("file", file);
  }
  return formData;
}
