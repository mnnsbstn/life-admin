import type { VehicleRepository } from "@/lib/repositories/types";
import {
  mapVehicleRow,
  mapVehicleToRow,
  type VehicleRow,
} from "@/lib/repositories/supabase/mappers/vehicle";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const supabaseVehicleRepository: VehicleRepository = {
  async list({ householdId }) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("household_id", householdId)
      .order("name");

    if (error) throw new Error(error.message);
    return (data as VehicleRow[]).map(mapVehicleRow);
  },

  async getById(id) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? mapVehicleRow(data as VehicleRow) : null;
  },

  async create(item) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const { data, error } = await supabase
      .from("vehicles")
      .insert(mapVehicleToRow(item))
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapVehicleRow(data as VehicleRow);
  },

  async update(id, patch) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const existing = await this.getById(id);
    if (!existing) throw new Error(`Vehicle not found: ${id}`);

    const merged = { ...existing, ...patch, id: existing.id };
    const row = {
      ...mapVehicleToRow(merged),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("vehicles")
      .update(row)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapVehicleRow(data as VehicleRow);
  },

  async delete(id) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
