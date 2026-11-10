import type { HouseholdRepository } from "@/lib/repositories/types";
import type { HouseholdInvitation } from "@/lib/domain/types";
import { getMockStore } from "@/lib/repositories/mock/mock-store";
import { newId, nowIso } from "@/lib/repositories/mock/utils";

function mapInvitation(row: HouseholdInvitation): HouseholdInvitation {
  return row;
}

export const mockHouseholdRepository: HouseholdRepository = {
  async getById(id) {
    return getMockStore().households.find((h) => h.id === id) ?? null;
  },

  async getForUser(userId) {
    const store = getMockStore();
    const householdIds = store.householdMembers
      .filter((m) => m.userId === userId)
      .map((m) => m.householdId);
    return store.households.filter((h) => householdIds.includes(h.id));
  },

  async update(id, patch) {
    const store = getMockStore();
    const index = store.households.findIndex((h) => h.id === id);
    if (index === -1) {
      throw new Error(`Household not found: ${id}`);
    }
    if (patch.name !== undefined) {
      store.households[index] = {
        ...store.households[index],
        name: patch.name,
      };
    }
    return store.households[index];
  },

  async getMemberRole(householdId, userId) {
    const store = getMockStore();
    const member = store.householdMembers.find(
      (m) => m.householdId === householdId && m.userId === userId,
    );
    return member?.role ?? null;
  },

  async listMembers(householdId) {
    const store = getMockStore();
    const members = store.householdMembers.filter(
      (m) => m.householdId === householdId,
    );
    if (members.length === 0) return [];

    return members.map((member) => {
      const user =
        member.userId === store.user.id
          ? store.user
          : {
              email: "partner@example.com",
              displayName: "Partner",
            };
      return {
        id: member.id,
        userId: member.userId,
        role: member.role,
        email: user.email,
        displayName: user.displayName,
        joinedAt: member.joinedAt,
      };
    });
  },

  async listInvitations(householdId) {
    const store = getMockStore();
    return store.invitations.filter(
      (inv) => inv.householdId === householdId && !inv.acceptedAt,
    );
  },

  async createInvitation({ householdId, email, role, createdByUserId }) {
    const store = getMockStore();
    const owner = store.householdMembers.find(
      (m) =>
        m.householdId === householdId &&
        m.userId === createdByUserId &&
        m.role === "owner",
    );
    if (!owner) {
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

    const household = store.households.find((h) => h.id === inv.householdId);
    if (!household) return null;

    return {
      invitation: inv,
      householdName: household.name,
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
