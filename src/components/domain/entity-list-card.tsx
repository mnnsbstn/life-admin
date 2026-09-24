import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface EntityListCardProps {
  href: string;
  title: string;
  subtitle?: string;
  meta?: string;
  badges?: React.ReactNode;
  className?: string;
}

export function EntityListCard({
  href,
  title,
  subtitle,
  meta,
  badges,
  className,
}: EntityListCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-start gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-all hover:border-border hover:shadow-md",
        className,
      )}
    >
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium leading-snug text-foreground">
            {title}
          </p>
          {badges}
        </div>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
        {meta ? (
          <p className="text-xs text-muted-foreground/90">{meta}</p>
        ) : null}
      </div>
      <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
    </Link>
  );
}
