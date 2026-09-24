import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ListPageHeaderProps {
  title: string;
  description: string;
  addHref: string;
  addLabel: string;
}

export function ListPageHeader({
  title,
  description,
  addHref,
  addLabel,
}: ListPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button asChild size="sm" className="shrink-0 shadow-sm">
        <Link href={addHref}>
          <Plus className="size-4" />
          {addLabel}
        </Link>
      </Button>
    </div>
  );
}
