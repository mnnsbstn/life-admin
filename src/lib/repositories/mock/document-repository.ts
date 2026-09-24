import type { DocumentFormValues } from "@/lib/domain/schemas/document";
import type { Document, ID } from "@/lib/domain/types";
import { generateId, getMockStore } from "@/lib/repositories/mock/store";
import type { DocumentRepository } from "@/lib/repositories/types";

function normalizeDocumentInput(input: DocumentFormValues) {
  return {
    ...input,
    issuedDate: input.issuedDate || undefined,
    homeItemId: input.homeItemId || undefined,
    contractId: input.contractId || undefined,
  };
}

export const mockDocumentRepository: DocumentRepository = {
  async list(householdId) {
    return getMockStore().documents.filter((d) => d.householdId === householdId);
  },

  async getById(id) {
    return getMockStore().documents.find((d) => d.id === id) ?? null;
  },

  async create(householdId, input) {
    const store = getMockStore();
    const now = new Date().toISOString();
    const normalized = normalizeDocumentInput(input);
    const document: Document = {
      id: generateId("doc"),
      householdId,
      title: normalized.title,
      type: normalized.type,
      fileName: normalized.fileName,
      mimeType: normalized.fileName?.endsWith(".pdf")
        ? "application/pdf"
        : undefined,
      storagePath: normalized.fileName
        ? `mock/${householdId}/${normalized.fileName}`
        : undefined,
      homeItemId: normalized.homeItemId,
      contractId: normalized.contractId,
      issuedDate: normalized.issuedDate,
      notes: normalized.notes,
      createdAt: now,
      updatedAt: now,
    };
    store.documents.push(document);
    return document;
  },

  async update(id, input) {
    const store = getMockStore();
    const index = store.documents.findIndex((d) => d.id === id);
    if (index === -1) throw new Error(`Document not found: ${id}`);
    const normalized = normalizeDocumentInput(input);
    const updated: Document = {
      ...store.documents[index],
      ...normalized,
      updatedAt: new Date().toISOString(),
    };
    store.documents[index] = updated;
    return updated;
  },

  async remove(id) {
    const store = getMockStore();
    store.documents = store.documents.filter((d) => d.id !== id);
  },
};
