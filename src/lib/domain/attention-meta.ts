import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Bell,
  CalendarClock,
  FileWarning,
  Shield,
  Wrench,
} from "lucide-react";

import type { AttentionKind } from "@/lib/domain/types";

export interface AttentionKindMeta {
  label: string;
  icon: LucideIcon;
}

export const attentionKindMeta: Record<AttentionKind, AttentionKindMeta> = {
  warranty: { label: "Garantie", icon: Shield },
  maintenance: { label: "Wartung", icon: Wrench },
  cancellation: { label: "Kündigung", icon: CalendarClock },
  contract_end: { label: "Vertragsende", icon: FileWarning },
  reminder: { label: "Erinnerung", icon: Bell },
  document_gap: { label: "Dokument", icon: AlertCircle },
};
