import type { ContractRepository } from "@/lib/repositories/types";
import {
  mapContractRow,
  mapContractToRow,
  type ContractRow,
} from "@/lib/repositories/supabase/mappers/contract";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const supabaseContractRepository: ContractRepository = {
  async list({ householdId }) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("contracts")
      .select("*")
      .eq("household_id", householdId)
      .order("name");

    if (error) throw new Error(error.message);
    return (data as ContractRow[]).map(mapContractRow);
  },

  async getById(id) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("contracts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? mapContractRow(data as ContractRow) : null;
  },

  async create(item) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const { data, error } = await supabase
      .from("contracts")
      .insert(mapContractToRow(item))
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapContractRow(data as ContractRow);
  },

  async update(id, patch) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const existing = await this.getById(id);
    if (!existing) throw new Error(`Contract not found: ${id}`);

    const merged = { ...existing, ...patch, id: existing.id };
    const row = {
      ...mapContractToRow(merged),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("contracts")
      .update(row)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapContractRow(data as ContractRow);
  },

  async delete(id) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const { error } = await supabase.from("contracts").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
