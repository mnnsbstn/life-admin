import type { FinancialAccountRepository } from "@/lib/repositories/types";
import {
  mapFinancialAccountRow,
  mapFinancialAccountToRow,
  type FinancialAccountRow,
} from "@/lib/repositories/supabase/mappers/financial-account";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const supabaseFinancialAccountRepository: FinancialAccountRepository = {
  async list({ householdId }) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("financial_accounts")
      .select("*")
      .eq("household_id", householdId)
      .order("name");

    if (error) throw new Error(error.message);
    return (data as FinancialAccountRow[]).map(mapFinancialAccountRow);
  },

  async getById(id) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("financial_accounts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? mapFinancialAccountRow(data as FinancialAccountRow) : null;
  },

  async create(item) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const { data, error } = await supabase
      .from("financial_accounts")
      .insert(mapFinancialAccountToRow(item))
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapFinancialAccountRow(data as FinancialAccountRow);
  },

  async update(id, patch) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const existing = await this.getById(id);
    if (!existing) throw new Error(`FinancialAccount not found: ${id}`);

    const merged = { ...existing, ...patch, id: existing.id };
    const row = {
      ...mapFinancialAccountToRow(merged),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("financial_accounts")
      .update(row)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapFinancialAccountRow(data as FinancialAccountRow);
  },

  async delete(id) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const { error } = await supabase
      .from("financial_accounts")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  },
};
