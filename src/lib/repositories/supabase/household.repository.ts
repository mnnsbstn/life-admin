import type { HouseholdRepository } from "@/lib/repositories/types";
import type { Household } from "@/lib/domain/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface HouseholdRow {
  id: string;
  name: string;
  created_at: string;
}

export const supabaseHouseholdRepository: HouseholdRepository = {
  async getById(id) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("households")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    const row = data as HouseholdRow;
    return {
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
    };
  },

  async getForUser(userId) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return [];

    const { data: memberships, error: memberError } = await supabase
      .from("household_members")
      .select("household_id")
      .eq("user_id", userId);

    if (memberError) throw new Error(memberError.message);
    if (!memberships?.length) return [];

    const ids = memberships.map((m) => m.household_id as string);

    const { data: households, error } = await supabase
      .from("households")
      .select("*")
      .in("id", ids);

    if (error) throw new Error(error.message);

    return (households as HouseholdRow[]).map(
      (row): Household => ({
        id: row.id,
        name: row.name,
        createdAt: row.created_at,
      }),
    );
  },
};
