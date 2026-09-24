import type { DocumentRepository } from "@/lib/repositories/types";
import {
  mapDocumentRow,
  mapDocumentToRow,
  type DocumentRow,
} from "@/lib/repositories/supabase/mappers/document";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const supabaseDocumentRepository: DocumentRepository = {
  async list({ householdId }) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("household_id", householdId)
      .order("title");

    if (error) throw new Error(error.message);
    return (data as DocumentRow[]).map(mapDocumentRow);
  },

  async getById(id) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ? mapDocumentRow(data as DocumentRow) : null;
  },

  async create(item) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const { data, error } = await supabase
      .from("documents")
      .insert(mapDocumentToRow(item))
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapDocumentRow(data as DocumentRow);
  },

  async update(id, patch) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Supabase client unavailable");

    const existing = await this.getById(id);
    if (!existing) throw new Error(`Document not found: ${id}`);

    const merged = { ...existing, ...patch, id: existing.id };
    const row = {
      ...mapDocumentToRow(merged),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("documents")
      .update(row)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapDocumentRow(data as DocumentRow);
  },
};
