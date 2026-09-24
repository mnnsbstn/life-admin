import type { IUserRepository } from "../types";
import { DEMO_USER_ID, getMockStore } from "./store";

export const mockUserRepository: IUserRepository = {
  getDemoUser() {
    const user = getMockStore().users.find((u) => u.id === DEMO_USER_ID);
    if (!user) throw new Error("Demo user missing from seed");
    return user;
  },
};
