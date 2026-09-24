import { withDerivedReminderStatus } from "@/lib/domain/reminder-status";
import type { ReminderRepository } from "@/lib/repositories/types";
import {
  mapReminderRow,
  mapReminderToRow,
  type ReminderRow,
} from "@/lib/repositories/supabase/mappers/reminder";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const supabaseReminderRepository: ReminderRepository = {
  async list({ householdId }) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("household_id", householdId)
      .order("due_date");

    if (error) throw new Error(error.message);
    return (data as ReminderRow[]).map(mapReminderRow);
  },

  async getById(id) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? mapReminderRow(data as ReminderRow) : null;
  },

  async create(item) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const payload = withDerivedReminderStatus({
      ...item,
      id: "temp",
      createdAt: "",
      updatedAt: "",
      status: item.status,
    });

    const { data, error } = await supabase
      .from("reminders")
      .insert(mapReminderToRow(payload))
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapReminderRow(data as ReminderRow);
  },

  async update(id, patch) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const existing = await this.getById(id);
    if (!existing) throw new Error(`Reminder not found: ${id}`);

    const merged = withDerivedReminderStatus({
      ...existing,
      ...patch,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: existing.updatedAt,
    });

    const row = {
      ...mapReminderToRow(merged),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("reminders")
      .update(row)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapReminderRow(data as ReminderRow);
  },

  async delete(id) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const { error } = await supabase.from("reminders").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
