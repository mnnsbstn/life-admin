import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CalendarDays,
  Car,
  FileSignature,
  FileText,
  Home,
  Settings,
  User,
  Users,
  Wallet,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  mobilePrimary?: boolean;
}

export const primaryNavItems: NavItem[] = [
  {
    id: "today",
    label: "Heute",
    href: "/today",
    icon: CalendarDays,
    mobilePrimary: true,
  },
  {
    id: "home",
    label: "Home",
    href: "/home",
    icon: Home,
    mobilePrimary: true,
  },
  {
    id: "contracts",
    label: "Verträge",
    href: "/contracts",
    icon: FileSignature,
    mobilePrimary: true,
  },
  {
    id: "documents",
    label: "Dokumente",
    href: "/documents",
    icon: FileText,
    mobilePrimary: true,
  },
  {
    id: "reminders",
    label: "Erinnerungen",
    href: "/reminders",
    icon: Bell,
    mobilePrimary: true,
  },
  {
    id: "vehicles",
    label: "Fahrzeuge",
    href: "/vehicles",
    icon: Car,
  },
  {
    id: "money",
    label: "Finanzen",
    href: "/money",
    icon: Wallet,
  },
  {
    id: "family",
    label: "Familie",
    href: "/family",
    icon: Users,
  },
];

export const secondaryNavItems: NavItem[] = [
  {
    id: "settings",
    label: "Einstellungen",
    href: "/settings",
    icon: Settings,
  },
  {
    id: "profile",
    label: "Profil",
    href: "/profile",
    icon: User,
  },
];

const allNavItems = [...primaryNavItems, ...secondaryNavItems];

export function getNavTitle(pathname: string): string {
  const exact = allNavItems.find((item) => item.href === pathname);
  if (exact) return exact.label;

  const section = primaryNavItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  if (section) return section.label;

  return "Life Admin";
}

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/today") {
    return pathname === "/today";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
