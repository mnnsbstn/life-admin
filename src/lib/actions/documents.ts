"use server";

import { redirect } from "next/navigation";

import { getDemoSession } from "@/lib/auth/demo-session";
import { revalidateLifeAdminCore } from "@/lib/actions/revalidate";
import {
  documentSchema,
  type DocumentFormValues,
} from "@/features/documents/schemas/document.schema";
import type { DocumentLinkTarget } from "@/lib/domain/types";
import { emptyToUndefined } from "@/lib/forms/parse";
import { getRepositories } from "@/lib/repositories";

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
    mockFileSizeBytes: 100_000,
    link: toLink(values),
    notes: emptyToUndefined(values.notes),
  };
}

export async function createDocumentAction(values: DocumentFormValues) {
  const parsed = documentSchema.parse(values);
  const { householdId } = await getDemoSession();
  const created = await getRepositories().documents.create(
    toEntity(parsed, householdId),
  );
  revalidateLifeAdminCore();
  redirect(`/documents/${created.id}`);
}

export async function updateDocumentAction(
  id: string,
  values: DocumentFormValues,
) {
  const parsed = documentSchema.parse(values);
  await getRepositories().documents.update(
    id,
    toEntity(parsed, (await getDemoSession()).householdId),
  );
  revalidateLifeAdminCore();
  redirect(`/documents/${id}`);
}
