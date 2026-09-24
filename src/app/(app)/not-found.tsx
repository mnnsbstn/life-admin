import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AppNotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Nicht gefunden</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Diese Seite oder dieses Objekt existiert nicht (mehr).
      </p>
      <Button asChild size="sm">
        <Link href="/today">Zurück zu Heute</Link>
      </Button>
    </div>
  );
}
