import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  FileText,
  Home,
  Bell,
  ScrollText,
  Settings,
  User,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  mobilePrimary?: boolean;
};

export const primaryNavItems: NavItem[] = [
  { title: "Today", href: "/today", icon: CalendarDays, mobilePrimary: true },
  { title: "Home", href: "/home", icon: Home, mobilePrimary: true },
  {
    title: "Contracts",
    href: "/contracts",
    icon: ScrollText,
    mobilePrimary: true,
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
    mobilePrimary: true,
  },
  {
    title: "Reminders",
    href: "/reminders",
    icon: Bell,
    mobilePrimary: true,
  },
];

export const secondaryNavItems: NavItem[] = [
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Profile", href: "/profile", icon: User },
];

export type QuickAddTarget = {
  label: string;
  href: string;
  description: string;
};

export const quickAddTargets: QuickAddTarget[] = [
  {
    label: "Home item",
    href: "/home/new",
    description: "Appliance, system, or room asset",
  },
  {
    label: "Contract",
    href: "/contracts/new",
    description: "Subscription, insurance, or utility",
  },
  {
    label: "Document",
    href: "/documents/new",
    description: "Invoice, manual, or certificate",
  },
  {
    label: "Reminder",
    href: "/reminders/new",
    description: "Task linked to something you own",
  },
];
