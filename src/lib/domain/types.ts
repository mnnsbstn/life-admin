export type UUID = string;

export type HouseholdMemberRole = "owner" | "member" | "viewer";

export interface User {
  id: UUID;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Household {
  id: UUID;
  name: string;
  createdAt: string;
}

export interface HouseholdMember {
  id: UUID;
  householdId: UUID;
  userId: UUID;
  role: HouseholdMemberRole;
  joinedAt: string;
}

/** Member row with profile fields for settings UI */
export interface HouseholdMemberView {
  id: UUID;
  userId: UUID;
  role: HouseholdMemberRole;
  email: string;
  displayName: string;
  joinedAt: string;
}

export interface HouseholdInvitation {
  id: UUID;
  householdId: UUID;
  email: string;
  role: Exclude<HouseholdMemberRole, "owner">;
  token: string;
  expiresAt: string;
  acceptedAt?: string;
  createdAt: string;
}

export type HomeItemCategory =
  | "heating"
  | "electricity"
  | "water"
  | "internet"
  | "appliances"
  | "kitchen"
  | "bathroom"
  | "smart_home"
  | "garden"
  | "renovation"
  | "other";

export interface HomeItem {
  id: UUID;
  householdId: UUID;
  name: string;
  category: HomeItemCategory;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  location?: string;
  purchaseDate?: string;
  installationDate?: string;
  purchasePriceCents?: number;
  currency?: "EUR";
  warrantyEndsAt?: string;
  lastMaintenanceAt?: string;
  nextMaintenanceAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContractCategory =
  | "electricity"
  | "internet"
  | "mobile"
  | "insurance"
  | "streaming"
  | "membership"
  | "software"
  | "other";

export type PaymentInterval = "monthly" | "quarterly" | "yearly" | "once";

export interface Contract {
  id: UUID;
  householdId: UUID;
  name: string;
  provider: string;
  category: ContractCategory;
  costCents?: number;
  currency?: "EUR";
  paymentInterval?: PaymentInterval;
  startDate?: string;
  minimumTermMonths?: number;
  noticePeriodDays?: number;
  nextCancellationDate?: string;
  autoRenewal?: boolean;
  contractEndDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType =
  | "invoice"
  | "contract"
  | "manual"
  | "warranty"
  | "insurance"
  | "certificate"
  | "receipt"
  | "other";

export type DocumentLinkTarget =
  | { type: "home_item"; id: UUID }
  | { type: "contract"; id: UUID }
  | { type: "none" };

export interface Document {
  id: UUID;
  householdId: UUID;
  title: string;
  documentType: DocumentType;
  issuedAt?: string;
  mockFileName?: string;
  mockFileSizeBytes?: number;
  storagePath?: string;
  mimeType?: string;
  link: DocumentLinkTarget;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReminderStatus = "upcoming" | "due" | "completed";
export type ReminderPriority = "low" | "medium" | "high";

export type ReminderLink =
  | { type: "home_item"; id: UUID }
  | { type: "contract"; id: UUID }
  | { type: "standalone" };

export interface Reminder {
  id: UUID;
  householdId: UUID;
  title: string;
  dueDate: string;
  status: ReminderStatus;
  priority: ReminderPriority;
  link: ReminderLink;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type AttentionKind =
  | "warranty"
  | "maintenance"
  | "cancellation"
  | "contract_end"
  | "reminder"
  | "document_gap";

export interface AttentionItem {
  id: string;
  kind: AttentionKind;
  title: string;
  subtitle?: string;
  dueDate: string;
  urgencyDays: number;
  href: string;
  entityType: "home_item" | "contract" | "document" | "reminder";
  entityId: UUID;
}

export interface UpcomingItem {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  href: string;
}
