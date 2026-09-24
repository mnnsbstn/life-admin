import type { HomeItemRepository } from "@/lib/repositories/types";
import {
  mapHomeItemRow,
  mapHomeItemToRow,
  type HomeItemRow,
} from "@/lib/repositories/supabase/mappers/home-item";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const supabaseHomeItemRepository: HomeItemRepository = {
  async list({ householdId }) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("home_items")
      .select("*")
      .eq("household_id", householdId)
      .order("name");

    if (error) throw new Error(error.message);
    return (data as HomeItemRow[]).map(mapHomeItemRow);
  },

  async getById(id) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("home_items")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? mapHomeItemRow(data as HomeItemRow) : null;
  },

  async create(item) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const { data, error } = await supabase
      .from("home_items")
      .insert(mapHomeItemToRow(item))
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapHomeItemRow(data as HomeItemRow);
  },

  async update(id, patch) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const existing = await this.getById(id);
    if (!existing) throw new Error(`HomeItem not found: ${id}`);

    const merged = { ...existing, ...patch, id: existing.id };
    const row = {
      ...mapHomeItemToRow(merged),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("home_items")
      .update(row)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapHomeItemRow(data as HomeItemRow);
  },
};
