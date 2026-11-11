import type {
  CalendarProvider,
  CalendarSyncedEvent,
  UserCalendarConnection,
} from "@/lib/domain/types";
import type { CalendarIntegrationRepository } from "@/lib/repositories/types";
import { newId, nowIso } from "@/lib/repositories/mock/utils";

const connections = new Map<string, UserCalendarConnection>();
const synced = new Map<string, CalendarSyncedEvent>();

function connectionKey(userId: string, provider: CalendarProvider): string {
  return `${userId}:${provider}`;
}

function syncKey(
  userId: string,
  provider: CalendarProvider,
  sourceKind: string,
  sourceId: string,
): string {
  return `${userId}:${provider}:${sourceKind}:${sourceId}`;
}

export const mockCalendarIntegrationRepository: CalendarIntegrationRepository =
  {
    async getConnection(userId, provider) {
      return connections.get(connectionKey(userId, provider)) ?? null;
    },

    async upsertConnection(input) {
      const key = connectionKey(input.userId, input.provider);
      const existing = connections.get(key);
      const row: UserCalendarConnection = {
        id: existing?.id ?? input.id ?? newId(),
        userId: input.userId,
        provider: input.provider,
        accountEmail: input.accountEmail,
        refreshToken: input.refreshToken,
        accessToken: input.accessToken,
        accessTokenExpiresAt: input.accessTokenExpiresAt,
        calendarId: input.calendarId,
        createdAt: existing?.createdAt ?? nowIso(),
        updatedAt: nowIso(),
      };
      connections.set(key, row);
      return row;
    },

    async deleteConnection(userId, provider) {
      connections.delete(connectionKey(userId, provider));
      for (const [key] of synced) {
        if (key.startsWith(`${userId}:${provider}:`)) synced.delete(key);
      }
    },

    async updateAccessToken(userId, provider, accessToken, expiresAt) {
      const key = connectionKey(userId, provider);
      const row = connections.get(key);
      if (!row) return;
      connections.set(key, {
        ...row,
        accessToken,
        accessTokenExpiresAt: expiresAt,
        updatedAt: nowIso(),
      });
    },

    async getSyncedEvent(userId, provider, sourceKind, sourceId) {
      return synced.get(syncKey(userId, provider, sourceKind, sourceId)) ?? null;
    },

    async recordSyncedEvent(input) {
      const key = syncKey(
        input.userId,
        input.provider,
        input.sourceKind,
        input.sourceId,
      );
      const row: CalendarSyncedEvent = {
        id: input.id ?? newId(),
        userId: input.userId,
        provider: input.provider,
        sourceKind: input.sourceKind,
        sourceId: input.sourceId,
        externalEventId: input.externalEventId,
        createdAt: nowIso(),
      };
      synced.set(key, row);
      return row;
    },
  };
