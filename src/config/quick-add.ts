import type { LucideIcon } from "lucide-react";
import { Bell, FileSignature, FileText, Home } from "lucide-react";

export interface QuickAddAction {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export const quickAddActions: QuickAddAction[] = [
  {
    id: "home_item",
    label: "Home Item",
    description: "Gerät, Anlage oder Bereich im Haushalt",
    href: "/home/new",
    icon: Home,
  },
  {
    id: "contract",
    label: "Vertrag",
    description: "Strom, Internet, Versicherung & mehr",
    href: "/contracts/new",
    icon: FileSignature,
  },
  {
    id: "document",
    label: "Dokument",
    description: "Rechnung, Vertrag, Garantie, …",
    href: "/documents/new",
    icon: FileText,
  },
  {
    id: "reminder",
    label: "Erinnerung",
    description: "Frist oder Aufgabe merken",
    href: "/reminders/new",
    icon: Bell,
  },
];
