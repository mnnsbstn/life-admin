"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { primaryNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { secondaryNav } from "@/config/navigation";

const mobileTabs = primaryNav.filter((item) => item.mobile !== false).slice(0, 4);

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border/60 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      aria-label="Mobile"
    >
      {mobileTabs.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="size-5" aria-hidden />
            {item.label}
          </Link>
        );
      })}
      <Sheet>
        <SheetTrigger
          render={
            <button
              type="button"
              className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium text-muted-foreground"
            >
              <MoreHorizontal className="size-5" aria-hidden />
              More
            </button>
          }
        />
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader>
            <SheetTitle>More</SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/reminders" className="rounded-lg px-2 py-2 text-sm hover:bg-muted">
              Reminders
            </Link>
            {secondaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-2 py-2 text-sm hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
