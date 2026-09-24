import type { UserRepository } from "@/lib/repositories/types";
import { getMockStore } from "@/lib/repositories/mock/mock-store";

export const mockUserRepository: UserRepository = {
  async getCurrentUser() {
    return getMockStore().user;
  },
};
