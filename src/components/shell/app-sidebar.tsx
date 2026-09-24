"use client";

import Link from "next/link";

import { NavLink } from "@/components/shell/nav-link";
import { primaryNavItems, secondaryNavItems } from "@/config/navigation";
import { useHousehold } from "@/providers/household-context";

export function AppSidebar() {
  const { householdName } = useHousehold();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border/80 bg-card/40 md:flex">
      <div className="border-b border-border/80 px-5 py-5">
        <Link
          href="/today"
          className="text-[15px] font-semibold tracking-tight text-foreground"
        >
          Life Admin
        </Link>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {householdName}
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {primaryNavItems.map((item) => (
          <NavLink key={item.id} item={item} variant="sidebar" />
        ))}
      </nav>

      <div className="flex flex-col gap-0.5 border-t border-border/80 p-3">
        {secondaryNavItems.map((item) => (
          <NavLink key={item.id} item={item} variant="sidebar" />
        ))}
      </div>
    </aside>
  );
}
