import type { EntityType, ID } from "@/lib/domain/types";

export type AttentionKind =
  | "contract_expiring"
  | "contract_cancellation_window"
  | "warranty_expiring"
  | "maintenance_due"
  | "reminder_due"
  | "document_missing";

export interface AttentionItem {
  id: string;
  kind: AttentionKind;
  title: string;
  subtitle?: string;
  dueDate: string;
  urgencyScore: number;
  entityType: EntityType;
  entityId: ID;
  href: string;
}
