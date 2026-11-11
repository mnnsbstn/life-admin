import { NextResponse } from "next/server";

import { getAppSession } from "@/lib/auth/session";
import { getRepositories } from "@/lib/repositories";
import { createDocumentDownloadUrl } from "@/lib/supabase/storage/documents";

interface DownloadRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: DownloadRouteContext) {
  const { id } = await context.params;
  const { householdId } = await getAppSession();
  const document = await getRepositories().documents.getById(id);

  if (!document || document.householdId !== householdId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!document.storagePath) {
    return NextResponse.json({ error: "No file attached" }, { status: 404 });
  }

  try {
    const signedUrl = await createDocumentDownloadUrl(document.storagePath);
    if (!signedUrl) {
      return NextResponse.json(
        { error: "Storage unavailable" },
        { status: 503 },
      );
    }
    return NextResponse.redirect(signedUrl);
  } catch {
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
