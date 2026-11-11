import type {
  CalendarProvider,
  CalendarSyncedEvent,
  UserCalendarConnection,
} from "@/lib/domain/types";
import type { CalendarIntegrationRepository } from "@/lib/repositories/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ConnectionRow = {
  id: string;
  user_id: string;
  provider: CalendarProvider;
  account_email: string | null;
  refresh_token: string;
  access_token: string | null;
  access_token_expires_at: string | null;
  calendar_id: string;
  created_at: string;
  updated_at: string;
};

type SyncedRow = {
  id: string;
  user_id: string;
  provider: CalendarProvider;
  source_kind: string;
  source_id: string;
  external_event_id: string;
  created_at: string;
};

function mapConnection(row: ConnectionRow): UserCalendarConnection {
  return {
    id: row.id,
    userId: row.user_id,
    provider: row.provider,
    accountEmail: row.account_email ?? undefined,
    refreshToken: row.refresh_token,
    accessToken: row.access_token ?? undefined,
    accessTokenExpiresAt: row.access_token_expires_at ?? undefined,
    calendarId: row.calendar_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSynced(row: SyncedRow): CalendarSyncedEvent {
  return {
    id: row.id,
    userId: row.user_id,
    provider: row.provider,
    sourceKind: row.source_kind,
    sourceId: row.source_id,
    externalEventId: row.external_event_id,
    createdAt: row.created_at,
  };
}

export const supabaseCalendarIntegrationRepository: CalendarIntegrationRepository =
  {
    async getConnection(userId, provider) {
      const supabase = await createSupabaseServerClient();
      if (!supabase) return null;

      const { data, error } = await supabase
        .from("user_calendar_connections")
        .select("*")
        .eq("user_id", userId)
        .eq("provider", provider)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data ? mapConnection(data as ConnectionRow) : null;
    },

    async upsertConnection(input) {
      const supabase = await createSupabaseServerClient();
      if (!supabase) throw new Error("Supabase not configured");

      const { data, error } = await supabase
        .from("user_calendar_connections")
        .upsert(
          {
            user_id: input.userId,
            provider: input.provider,
            account_email: input.accountEmail ?? null,
            refresh_token: input.refreshToken,
            access_token: input.accessToken ?? null,
            access_token_expires_at: input.accessTokenExpiresAt ?? null,
            calendar_id: input.calendarId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,provider" },
        )
        .select("*")
        .single();

      if (error) throw new Error(error.message);
      return mapConnection(data as ConnectionRow);
    },

    async deleteConnection(userId, provider) {
      const supabase = await createSupabaseServerClient();
      if (!supabase) return;

      const { error: syncError } = await supabase
        .from("calendar_synced_events")
        .delete()
        .eq("user_id", userId)
        .eq("provider", provider);
      if (syncError) throw new Error(syncError.message);

      const { error } = await supabase
        .from("user_calendar_connections")
        .delete()
        .eq("user_id", userId)
        .eq("provider", provider);
      if (error) throw new Error(error.message);
    },

    async updateAccessToken(userId, provider, accessToken, expiresAt) {
      const supabase = await createSupabaseServerClient();
      if (!supabase) return;

      const { error } = await supabase
        .from("user_calendar_connections")
        .update({
          access_token: accessToken,
          access_token_expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("provider", provider);

      if (error) throw new Error(error.message);
    },

    async getSyncedEvent(userId, provider, sourceKind, sourceId) {
      const supabase = await createSupabaseServerClient();
      if (!supabase) return null;

      const { data, error } = await supabase
        .from("calendar_synced_events")
        .select("*")
        .eq("user_id", userId)
        .eq("provider", provider)
        .eq("source_kind", sourceKind)
        .eq("source_id", sourceId)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data ? mapSynced(data as SyncedRow) : null;
    },

    async recordSyncedEvent(input) {
      const supabase = await createSupabaseServerClient();
      if (!supabase) throw new Error("Supabase not configured");

      const { data, error } = await supabase
        .from("calendar_synced_events")
        .upsert(
          {
            user_id: input.userId,
            provider: input.provider,
            source_kind: input.sourceKind,
            source_id: input.sourceId,
            external_event_id: input.externalEventId,
          },
          { onConflict: "user_id,provider,source_kind,source_id" },
        )
        .select("*")
        .single();

      if (error) throw new Error(error.message);
      return mapSynced(data as SyncedRow);
    },
  };
