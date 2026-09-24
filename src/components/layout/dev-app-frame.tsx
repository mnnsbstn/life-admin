"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  primaryNavItems,
  secondaryNavItems,
} from "@/lib/constants/navigation";
import { siteConfig } from "@/config/site";

/**
 * Lightweight shell for Step 2 — replaced by full App Shell in Step 4.
 */
export function DevAppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="hidden w-56 shrink-0 border-r border-border/80 bg-sidebar md:flex md:flex-col">
        <div className="flex h-14 items-center px-5">
          <span className="text-sm font-semibold tracking-tight">
            {siteConfig.name}
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3 pb-4">
          {primaryNavItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                )}
              >
                {item.title}
              </Link>
            );
          })}
          <div className="mt-auto flex flex-col gap-0.5 border-t border-sidebar-border pt-3">
            {secondaryNavItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-14 items-center border-b border-border/80 px-4 md:px-8">
          <span className="text-sm font-medium md:hidden">{siteConfig.name}</span>
          <span className="hidden text-xs text-muted-foreground md:inline">
            Project setup · navigation scaffold
          </span>
        </header>
        <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
        <nav className="flex border-t border-border/80 md:hidden">
          {primaryNavItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center py-2 text-[10px]",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="mb-0.5 size-4" aria-hidden />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
