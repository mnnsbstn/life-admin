import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AddPlaceholderProps {
  title: string;
  backHref: string;
}

export function AddPlaceholder({ title, backHref }: AddPlaceholderProps) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 py-4">
      <Button variant="ghost" size="sm" className="w-fit gap-1.5 px-0" asChild>
        <Link href={backHref}>
          <ArrowLeft className="size-4" />
          Zurück
        </Link>
      </Button>
      <div className="rounded-xl border border-border/70 bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Das Formular zum Anlegen kommt in Step 8. Quick Add und Navigation
          sind bereits vorbereitet.
        </p>
      </div>
    </div>
  );
}
