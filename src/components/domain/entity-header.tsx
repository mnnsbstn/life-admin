import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EntityHeaderProps {
  backHref: string;
  backLabel?: string;
  title: string;
  description?: string;
  badges?: React.ReactNode;
  editHref?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function EntityHeader({
  backHref,
  backLabel = "Zurück",
  title,
  description,
  badges,
  editHref,
  actions,
  className,
}: EntityHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-0" asChild>
        <Link href={backHref}>
          <ArrowLeft className="size-4" />
          {backLabel}
        </Link>
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {badges}
          </div>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {actions}
          {editHref ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={editHref}>
                <Pencil className="size-4" />
                Bearbeiten
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
