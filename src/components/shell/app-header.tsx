"use client";

import { usePathname } from "next/navigation";

import { QuickAdd } from "@/components/shell/quick-add";
import { getNavTitle } from "@/config/navigation";

export function AppHeader() {
  const pathname = usePathname();
  const title = getNavTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border/80 bg-background/85 px-4 backdrop-blur-md md:px-8">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground md:text-base">
          {title}
        </p>
      </div>
      <QuickAdd />
    </header>
  );
}
