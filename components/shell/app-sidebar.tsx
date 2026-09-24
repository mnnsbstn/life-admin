"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav, secondaryNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-56 lg:flex-col lg:border-r lg:border-border/60 lg:bg-sidebar lg:px-3 lg:py-5">
      <Link href="/today" className="mb-6 flex items-center gap-2 px-2">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Sparkles className="size-4" aria-hidden />
        </span>
        <span className="text-sm font-semibold tracking-tight">Life Admin</span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
        {primaryNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <nav className="mt-auto flex flex-col gap-1 border-t border-sidebar-border pt-3" aria-label="Secondary">
        {secondaryNav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
