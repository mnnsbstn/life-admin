import Link from "next/link";

import { primaryNavItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const remindersNav = primaryNavItems[4];

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="hidden w-56 shrink-0 border-r border-border/80 bg-card/30 md:flex md:flex-col">
        <div className="border-b border-border/80 px-5 py-5">
          <Link href="/today" className="text-sm font-semibold tracking-tight">
            Life Admin
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">V0.1 Setup</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {primaryNavItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-14 items-center border-b border-border/80 px-4 md:px-8">
          <span className="text-sm text-muted-foreground md:hidden">
            Life Admin
          </span>
        </header>
        <main className="flex-1 pb-20 md:pb-0">{children}</main>

        <nav className="fixed inset-x-0 bottom-0 flex border-t border-border/80 bg-background/95 backdrop-blur md:hidden">
          {primaryNavItems.slice(0, 4).map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-1 py-2 text-[10px] text-muted-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
          <Link
            href={remindersNav.href}
            className="flex flex-1 flex-col items-center gap-1 py-2 text-[10px] text-muted-foreground"
          >
            <remindersNav.icon className="size-4" />
            {remindersNav.label}
          </Link>
        </nav>
      </div>
    </div>
  );
}
