"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "@/config/navigation";
import { isNavActive } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  item: NavItem;
  variant?: "sidebar" | "mobile";
  onNavigate?: () => void;
}

export function NavLink({ item, variant = "sidebar", onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const active = isNavActive(pathname, item.href);
  const Icon = item.icon;

  if (variant === "mobile") {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors",
          active ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <Icon className={cn("size-4", active && "stroke-[2.25]")} />
        <span className="truncate px-0.5">{item.label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-background font-medium text-foreground shadow-sm ring-1 ring-border/60"
          : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
      )}
    >
      <Icon className="size-4 shrink-0 opacity-80" strokeWidth={active ? 2.25 : 1.75} />
      {item.label}
    </Link>
  );
}
