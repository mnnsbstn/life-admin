"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { documentFormSchema } from "@/lib/domain/types/document";
import { DEMO_HOUSEHOLD_ID, getRepositories } from "@/lib/repositories";

function parseDocumentForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return {
    ...raw,
    sizeBytes: raw.sizeBytes ? Number(raw.sizeBytes) : null,
    homeItemId: raw.homeItemId || null,
    contractId: raw.contractId || null,
  };
}

export async function createDocumentAction(formData: FormData) {
  const parsed = documentFormSchema.safeParse(parseDocumentForm(formData));
  if (!parsed.success) {
    return;
  }
  const item = getRepositories().documents.create(DEMO_HOUSEHOLD_ID, parsed.data);
  revalidatePath("/documents");
  revalidatePath("/today");
  redirect(`/documents/${item.id}`);
}

export async function updateDocumentAction(id: string, formData: FormData) {
  const parsed = documentFormSchema.partial().safeParse(parseDocumentForm(formData));
  if (!parsed.success) {
    return;
  }
  getRepositories().documents.update(id, parsed.data);
  revalidatePath("/documents");
  revalidatePath(`/documents/${id}`);
  revalidatePath("/today");
  redirect(`/documents/${id}`);
}
