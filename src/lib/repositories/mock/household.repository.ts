import type { HouseholdRepository } from "@/lib/repositories/types";
import type { HouseholdInvitation } from "@/lib/domain/types";
import { getMockStore } from "@/lib/repositories/mock/mock-store";
import { newId, nowIso } from "@/lib/repositories/mock/utils";

function mapInvitation(row: HouseholdInvitation): HouseholdInvitation {
  return row;
}

export const mockHouseholdRepository: HouseholdRepository = {
  async getById(id) {
    const { household } = getMockStore();
    return household.id === id ? household : null;
  },

  async getForUser(userId) {
    const store = getMockStore();
    if (store.householdMember.userId !== userId) {
      return [];
    }
    return [store.household];
  },

  async update(id, patch) {
    const store = getMockStore();
    if (store.household.id !== id) {
      throw new Error(`Household not found: ${id}`);
    }
    if (patch.name !== undefined) {
      store.household = { ...store.household, name: patch.name };
    }
    return store.household;
  },

  async getMemberRole(householdId, userId) {
    const store = getMockStore();
    if (
      store.household.id !== householdId ||
      store.householdMember.userId !== userId
    ) {
      return null;
    }
    return store.householdMember.role;
  },

  async listMembers(householdId) {
    const store = getMockStore();
    if (store.household.id !== householdId) return [];

    return [
      {
        id: store.householdMember.id,
        userId: store.user.id,
        role: store.householdMember.role,
        email: store.user.email,
        displayName: store.user.displayName,
        joinedAt: store.householdMember.joinedAt,
      },
    ];
  },

  async listInvitations(householdId) {
    const store = getMockStore();
    return store.invitations.filter(
      (inv) => inv.householdId === householdId && !inv.acceptedAt,
    );
  },

  async createInvitation({ householdId, email, role, createdByUserId }) {
    const store = getMockStore();
    if (store.household.id !== householdId) {
      throw new Error("Household not found");
    }
    if (store.householdMember.userId !== createdByUserId) {
      throw new Error("Only owners can invite");
    }
    if (store.householdMember.role !== "owner") {
      throw new Error("Only owners can invite");
    }

    const created: HouseholdInvitation = {
      id: newId(),
      householdId,
      email: email.trim().toLowerCase(),
      role,
      token: newId().replace(/-/g, ""),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: nowIso(),
    };
    store.invitations.push(created);
    return mapInvitation(created);
  },

  async revokeInvitation(id) {
    const store = getMockStore();
    store.invitations = store.invitations.filter((inv) => inv.id !== id);
  },

  async getInvitationByToken(token) {
    const store = getMockStore();
    const inv = store.invitations.find(
      (i) => i.token === token && !i.acceptedAt,
    );
    if (!inv) return null;
    if (new Date(inv.expiresAt).getTime() < Date.now()) return null;

    return {
      invitation: inv,
      householdName: store.household.name,
    };
  },

  async acceptInvitation(token, userId) {
    const store = getMockStore();
    const inv = store.invitations.find(
      (i) => i.token === token && !i.acceptedAt,
    );
    if (!inv) {
      throw new Error("Invalid or expired invitation");
    }
    if (new Date(inv.expiresAt).getTime() < Date.now()) {
      throw new Error("Invalid or expired invitation");
    }
    if (inv.email !== store.user.email.toLowerCase()) {
      throw new Error("Invitation email does not match your account");
    }
    if (userId !== store.user.id) {
      throw new Error("Wrong user");
    }

    inv.acceptedAt = nowIso();
    return inv.householdId;
  },
};
