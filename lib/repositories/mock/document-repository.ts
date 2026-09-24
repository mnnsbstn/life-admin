import type { DocumentFormValues } from "@/lib/domain/types/document";
import type { IDocumentRepository } from "../types";
import { getMockStore } from "./store";

export const mockDocumentRepository: IDocumentRepository = {
  list(householdId) {
    return getMockStore().documents.filter((d) => d.householdId === householdId);
  },
  getById(id) {
    return getMockStore().documents.find((d) => d.id === id);
  },
  create(householdId, data) {
    const now = new Date().toISOString();
    const item = {
      id: crypto.randomUUID(),
      householdId,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    getMockStore().documents.push(item);
    return item;
  },
  update(id, data) {
    const store = getMockStore();
    const idx = store.documents.findIndex((d) => d.id === id);
    if (idx === -1) return undefined;
    const updated = {
      ...store.documents[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    store.documents[idx] = updated;
    return updated;
  },
  delete(id) {
    const store = getMockStore();
    const before = store.documents.length;
    store.documents = store.documents.filter((d) => d.id !== id);
    return store.documents.length < before;
  },
};
