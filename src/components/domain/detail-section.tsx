import { cn } from "@/lib/utils";

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function DetailSection({ title, children, className }: DetailSectionProps) {
  return (
    <section className={cn("space-y-3", className)}>
      <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
        {children}
      </div>
    </section>
  );
}

interface DetailFieldProps {
  label: string;
  value?: React.ReactNode;
}

export function DetailField({ label, value }: DetailFieldProps) {
  const display =
    value === undefined || value === null || value === "" ? "—" : value;

  return (
    <div className="grid gap-1 py-2 sm:grid-cols-[minmax(0,9rem)_1fr] sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{display}</dd>
    </div>
  );
}

export function DetailFieldList({ children }: { children: React.ReactNode }) {
  return (
    <dl className="divide-y divide-border/60 [&>div:first-child]:pt-0 [&>div:last-child]:pb-0">
      {children}
    </dl>
  );
}
