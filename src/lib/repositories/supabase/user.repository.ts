import type { UserRepository } from "@/lib/repositories/types";
import type { User } from "@/lib/domain/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface ProfileRow {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
}

export const supabaseUserRepository: UserRepository = {
  async getCurrentUser(): Promise<User> {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      throw new Error("Supabase client unavailable");
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Not authenticated");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      const row = profile as ProfileRow;
      return {
        id: row.id,
        email: row.email,
        displayName: row.display_name,
        avatarUrl: row.avatar_url ?? undefined,
        createdAt: row.created_at,
      };
    }

    return {
      id: user.id,
      email: user.email ?? "",
      displayName:
        (user.user_metadata?.display_name as string | undefined) ??
        user.email?.split("@")[0] ??
        "User",
      createdAt: user.created_at,
    };
  },
};
