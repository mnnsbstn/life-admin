"use client";

import { usePathname } from "next/navigation";
import { primaryNav, secondaryNav } from "@/config/navigation";
import { QuickAdd } from "./quick-add";

const titles: Record<string, string> = {
  "/today": "Today",
  "/home": "Home",
  "/contracts": "Contracts",
  "/documents": "Documents",
  "/reminders": "Reminders",
  "/settings": "Settings",
  "/profile": "Profile",
};

function resolveTitle(pathname: string): string {
  if (titles[pathname]) return titles[pathname];
  const all = [...primaryNav, ...secondaryNav];
  const base = all.find((n) => pathname.startsWith(n.href));
  if (base) {
    if (pathname.endsWith("/new")) return `New ${base.label.replace(/s$/, "")}`;
    if (pathname.includes("/edit")) return `Edit ${base.label.replace(/s$/, "")}`;
    if (pathname !== base.href) return base.label;
  }
  return "Life Admin";
}

export function AppHeader() {
  const pathname = usePathname();
  const title = resolveTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-background/90 px-4 backdrop-blur md:px-6">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      <QuickAdd />
    </header>
  );
}
