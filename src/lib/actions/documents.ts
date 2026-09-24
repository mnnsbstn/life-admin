"use server";

import { redirect } from "next/navigation";

import { getAppSession } from "@/lib/auth/session";
import { assertEntityInHousehold } from "@/lib/actions/entity-guard";
import { revalidateLifeAdminCore } from "@/lib/actions/revalidate";
import {
  documentSchema,
  type DocumentFormValues,
} from "@/features/documents/schemas/document.schema";
import type { DocumentLinkTarget } from "@/lib/domain/types";
import { emptyToUndefined } from "@/lib/forms/parse";
import { getRepositories } from "@/lib/repositories";
import { shouldUseSupabaseBackend } from "@/lib/supabase/env";
import { uploadDocumentFile } from "@/lib/supabase/storage/documents";

function parseDocumentFormData(formData: FormData): DocumentFormValues {
  return documentSchema.parse({
    title: formData.get("title"),
    documentType: formData.get("documentType"),
    issuedAt: formData.get("issuedAt"),
    mockFileName: formData.get("mockFileName"),
    linkType: formData.get("linkType"),
    linkTargetId: formData.get("linkTargetId"),
    notes: formData.get("notes"),
  });
}

function toLink(values: DocumentFormValues): DocumentLinkTarget {
  if (values.linkType === "home_item" && values.linkTargetId) {
    return { type: "home_item", id: values.linkTargetId };
  }
  if (values.linkType === "contract" && values.linkTargetId) {
    return { type: "contract", id: values.linkTargetId };
  }
  return { type: "none" };
}

function toEntity(values: DocumentFormValues, householdId: string) {
  const title = values.title;
  return {
    householdId,
    title,
    documentType: values.documentType,
    issuedAt: emptyToUndefined(values.issuedAt),
    mockFileName:
      emptyToUndefined(values.mockFileName) ??
      `${title.toLowerCase().replace(/\s+/g, "-")}.pdf`,
    mockFileSizeBytes: shouldUseSupabaseBackend() ? undefined : 100_000,
    link: toLink(values),
    notes: emptyToUndefined(values.notes),
  };
}

async function attachUploadedFile(
  householdId: string,
  documentId: string,
  file: FormDataEntryValue | null,
) {
  if (!shouldUseSupabaseBackend()) return;
  if (!(file instanceof File) || file.size === 0) return;

  const uploaded = await uploadDocumentFile(householdId, documentId, file);
  await getRepositories().documents.update(documentId, {
    storagePath: uploaded.storagePath,
    mimeType: uploaded.mimeType,
    mockFileSizeBytes: uploaded.sizeBytes,
    mockFileName: uploaded.fileName,
  });
}

export async function createDocumentAction(formData: FormData) {
  const parsed = parseDocumentFormData(formData);
  const { householdId } = await getAppSession();
  const file = formData.get("file");

  const created = await getRepositories().documents.create(
    toEntity(parsed, householdId),
  );

  await attachUploadedFile(householdId, created.id, file);

  revalidateLifeAdminCore();
  redirect(`/documents/${created.id}`);
}

export async function updateDocumentAction(id: string, formData: FormData) {
  const parsed = parseDocumentFormData(formData);
  const { householdId } = await getAppSession();
  const file = formData.get("file");

  await getRepositories().documents.update(
    id,
    toEntity(parsed, householdId),
  );

  await attachUploadedFile(householdId, id, file);

  revalidateLifeAdminCore();
  redirect(`/documents/${id}`);
}

export async function deleteDocumentAction(id: string) {
  const { householdId } = await getAppSession();
  const repos = getRepositories();
  await assertEntityInHousehold(
    (entityId) => repos.documents.getById(entityId),
    id,
    householdId,
  );
  await repos.documents.delete(id);
  revalidateLifeAdminCore();
  redirect("/documents");
}
