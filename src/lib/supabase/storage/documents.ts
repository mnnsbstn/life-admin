import { createSupabaseServerClient } from "@/lib/supabase/server";

export const DOCUMENTS_BUCKET = "life-admin-documents";

export function buildDocumentStoragePath(
  householdId: string,
  documentId: string,
  fileName: string,
): string {
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${householdId}/${documentId}/${safe}`;
}

export interface UploadedDocumentFile {
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  fileName: string;
}

export async function uploadDocumentFile(
  householdId: string,
  documentId: string,
  file: File,
): Promise<UploadedDocumentFile> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase client unavailable");
  }

  const storagePath = buildDocumentStoragePath(
    householdId,
    documentId,
    file.name,
  );

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(storagePath, buffer, {
      upsert: true,
      contentType: file.type || "application/octet-stream",
    });

  if (error) {
    throw new Error(error.message);
  }

  return {
    storagePath,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    fileName: file.name,
  };
}

export async function createDocumentDownloadUrl(storagePath: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUrl(storagePath, 60 * 10);

  if (error) {
    throw new Error(error.message);
  }

  return data.signedUrl;
}

export async function deleteDocumentStorageFile(storagePath: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .remove([storagePath]);

  if (error) {
    throw new Error(error.message);
  }
}
