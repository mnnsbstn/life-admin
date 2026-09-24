import type { DocumentRepository } from "@/lib/repositories/types";
import { getMockStore } from "@/lib/repositories/mock/mock-store";
import { newId, nowIso } from "@/lib/repositories/mock/utils";

export const mockDocumentRepository: DocumentRepository = {
  async list({ householdId }) {
    return getMockStore().documents.filter((d) => d.householdId === householdId);
  },

  async getById(id) {
    return getMockStore().documents.find((d) => d.id === id) ?? null;
  },

  async create(item) {
    const store = getMockStore();
    const created = {
      ...item,
      id: newId(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    store.documents.push(created);
    return created;
  },

  async update(id, patch) {
    const store = getMockStore();
    const index = store.documents.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error(`Document not found: ${id}`);
    }
    const updated = {
      ...store.documents[index],
      ...patch,
      id,
      updatedAt: nowIso(),
    };
    store.documents[index] = updated;
    return updated;
  },

  async delete(id) {
    const store = getMockStore();
    const index = store.documents.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error(`Document not found: ${id}`);
    }
    store.documents.splice(index, 1);
  },
};
