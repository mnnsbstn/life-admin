import Link from "next/link";

import { Button } from "@/components/ui/button";

interface ReadOnlyDemoNoticeProps {
  backHref: string;
  backLabel?: string;
}

export function ReadOnlyDemoNotice({
  backHref,
  backLabel = "Zurück zur Liste",
}: ReadOnlyDemoNoticeProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 py-12 text-center">
      <h1 className="text-xl font-semibold">Nur Demo-Ansicht</h1>
      <p className="text-sm text-muted-foreground">
        Auf GitHub Pages ist Life Admin read-only. Zum Anlegen und Bearbeiten brauchst
        du einen Node-Host (z. B. Vercel) mit Supabase oder Mock lokal.
      </p>
      <Button asChild variant="outline">
        <Link href={backHref}>{backLabel}</Link>
      </Button>
    </div>
  );
}
