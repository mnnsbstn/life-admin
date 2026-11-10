import type { VehicleRepository } from "@/lib/repositories/types";
import { getMockStore } from "@/lib/repositories/mock/mock-store";
import { newId, nowIso } from "@/lib/repositories/mock/utils";

export const mockVehicleRepository: VehicleRepository = {
  async list({ householdId }) {
    return getMockStore().vehicles.filter((v) => v.householdId === householdId);
  },

  async getById(id) {
    return getMockStore().vehicles.find((v) => v.id === id) ?? null;
  },

  async create(item) {
    const store = getMockStore();
    const created = {
      ...item,
      id: newId(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    store.vehicles.push(created);
    return created;
  },

  async update(id, patch) {
    const store = getMockStore();
    const index = store.vehicles.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new Error(`Vehicle not found: ${id}`);
    }
    const updated = {
      ...store.vehicles[index],
      ...patch,
      id,
      updatedAt: nowIso(),
    };
    store.vehicles[index] = updated;
    return updated;
  },

  async delete(id) {
    const store = getMockStore();
    const index = store.vehicles.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new Error(`Vehicle not found: ${id}`);
    }
    store.vehicles.splice(index, 1);
  },
};
