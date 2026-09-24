import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  FileText,
  Bell,
  Home,
  FileSignature,
  Settings,
  User,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  mobile?: boolean;
};

export const primaryNav: NavItem[] = [
  { href: "/today", label: "Today", icon: CalendarDays, mobile: true },
  { href: "/home", label: "Home", icon: Home, mobile: true },
  { href: "/contracts", label: "Contracts", icon: FileSignature, mobile: true },
  { href: "/documents", label: "Documents", icon: FileText, mobile: true },
  { href: "/reminders", label: "Reminders", icon: Bell, mobile: false },
];

export const secondaryNav: NavItem[] = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: User },
];

export const quickAddItems = [
  { href: "/home/new", label: "Home item", description: "Appliance, system, or device" },
  { href: "/contracts/new", label: "Contract", description: "Utility, insurance, or subscription" },
  { href: "/documents/new", label: "Document", description: "Invoice, manual, or warranty" },
  { href: "/reminders/new", label: "Reminder", description: "Task with a due date" },
] as const;
