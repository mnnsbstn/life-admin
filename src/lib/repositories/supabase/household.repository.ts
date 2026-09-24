import type { HouseholdRepository } from "@/lib/repositories/types";
import type {
  Household,
  HouseholdInvitation,
  HouseholdMemberRole,
  HouseholdMemberView,
} from "@/lib/domain/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface HouseholdRow {
  id: string;
  name: string;
  created_at: string;
}

interface InvitationRow {
  id: string;
  household_id: string;
  email: string;
  role: HouseholdInvitation["role"];
  token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
}

function mapHousehold(row: HouseholdRow): Household {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
  };
}

function mapInvitation(row: InvitationRow): HouseholdInvitation {
  return {
    id: row.id,
    householdId: row.household_id,
    email: row.email,
    role: row.role,
    token: row.token,
    expiresAt: row.expires_at,
    acceptedAt: row.accepted_at ?? undefined,
    createdAt: row.created_at,
  };
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

    return mapHousehold(data as HouseholdRow);
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

    return (households as HouseholdRow[]).map(mapHousehold);
  },

  async update(id, patch) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const { data, error } = await supabase
      .from("households")
      .update({ name: patch.name })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapHousehold(data as HouseholdRow);
  },

  async getMemberRole(householdId, userId) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("household_members")
      .select("role")
      .eq("household_id", householdId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data?.role as HouseholdMemberRole | undefined) ?? null;
  },

  async listMembers(householdId) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return [];

    const { data: members, error } = await supabase
      .from("household_members")
      .select("id, user_id, role, joined_at")
      .eq("household_id", householdId);

    if (error) throw new Error(error.message);
    if (!members?.length) return [];

    const userIds = members.map((m) => m.user_id as string);
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, display_name")
      .in("id", userIds);

    if (profileError) throw new Error(profileError.message);

    const profileById = new Map(
      (profiles ?? []).map((p) => [
        p.id as string,
        p as { id: string; email: string; display_name: string },
      ]),
    );

    return members.map(
      (row): HouseholdMemberView => {
        const profile = profileById.get(row.user_id as string);
        return {
          id: row.id as string,
          userId: row.user_id as string,
          role: row.role as HouseholdMemberRole,
          email: profile?.email ?? "",
          displayName: profile?.display_name ?? "Mitglied",
          joinedAt: row.joined_at as string,
        };
      },
    );
  },

  async listInvitations(householdId) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("household_invitations")
      .select("*")
      .eq("household_id", householdId)
      .is("accepted_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data as InvitationRow[]).map(mapInvitation);
  },

  async createInvitation({ householdId, email, role, createdByUserId }) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const { data, error } = await supabase
      .from("household_invitations")
      .insert({
        household_id: householdId,
        email: email.trim().toLowerCase(),
        role,
        created_by: createdByUserId,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapInvitation(data as InvitationRow);
  },

  async revokeInvitation(id) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const { error } = await supabase
      .from("household_invitations")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  },

  async getInvitationByToken(token) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("household_invitations")
      .select("*, households ( name )")
      .eq("token", token)
      .is("accepted_at", null)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    const row = data as InvitationRow & {
      households: { name: string } | null;
    };

    return {
      invitation: mapInvitation(row),
      householdName: row.households?.name ?? "Haushalt",
    };
  },

  async acceptInvitation(token, userId) {
    void userId;
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const { data, error } = await supabase.rpc("accept_household_invitation", {
      invite_token: token,
    });

    if (error) throw new Error(error.message);
    return data as string;
  },
};
