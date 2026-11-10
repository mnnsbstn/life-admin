import type { FamilyMemberRepository } from "@/lib/repositories/types";
import {
  mapFamilyMemberRow,
  mapFamilyMemberToRow,
  type FamilyMemberRow,
} from "@/lib/repositories/supabase/mappers/family-member";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const supabaseFamilyMemberRepository: FamilyMemberRepository = {
  async list({ householdId }) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("family_members")
      .select("*")
      .eq("household_id", householdId)
      .order("name");

    if (error) throw new Error(error.message);
    return (data as FamilyMemberRow[]).map(mapFamilyMemberRow);
  },

  async getById(id) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("family_members")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? mapFamilyMemberRow(data as FamilyMemberRow) : null;
  },

  async create(item) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const { data, error } = await supabase
      .from("family_members")
      .insert(mapFamilyMemberToRow(item))
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapFamilyMemberRow(data as FamilyMemberRow);
  },

  async update(id, patch) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const existing = await this.getById(id);
    if (!existing) throw new Error(`FamilyMember not found: ${id}`);

    const merged = { ...existing, ...patch, id: existing.id };
    const row = {
      ...mapFamilyMemberToRow(merged),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("family_members")
      .update(row)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapFamilyMemberRow(data as FamilyMemberRow);
  },

  async delete(id) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const { error } = await supabase.from("family_members").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
