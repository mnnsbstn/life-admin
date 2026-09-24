import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  FileText,
  Home,
  Bell,
  FileSignature,
  Settings,
  User,
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
    label: "Today",
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
    label: "Contracts",
    href: "/contracts",
    icon: FileSignature,
    mobilePrimary: true,
  },
  {
    id: "documents",
    label: "Documents",
    href: "/documents",
    icon: FileText,
    mobilePrimary: true,
  },
  {
    id: "reminders",
    label: "Reminders",
    href: "/reminders",
    icon: Bell,
    mobilePrimary: true,
  },
];

export const secondaryNavItems: NavItem[] = [
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    id: "profile",
    label: "Profile",
    href: "/profile",
    icon: User,
  },
];
