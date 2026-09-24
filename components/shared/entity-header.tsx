import { LinkButton } from "@/components/shared/link-button";
import { Pencil } from "lucide-react";

type EntityHeaderProps = {
  title: string;
  subtitle?: string;
  editHref?: string;
  actions?: React.ReactNode;
};

export function EntityHeader({ title, subtitle, editHref, actions }: EntityHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {actions}
        {editHref ? (
          <LinkButton href={editHref} variant="outline" size="sm">
            <Pencil className="mr-2 size-4" aria-hidden />
            Edit
          </LinkButton>
        ) : null}
      </div>
    </div>
  );
}
