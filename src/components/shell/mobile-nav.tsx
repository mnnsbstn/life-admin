"use client";

import { NavLink } from "@/components/shell/nav-link";
import { primaryNavItems } from "@/config/navigation";

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border/80 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      {primaryNavItems.map((item) => (
        <NavLink key={item.id} item={item} variant="mobile" />
      ))}
    </nav>
  );
}
