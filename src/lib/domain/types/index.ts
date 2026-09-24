export type ID = string;

export type HouseholdRole = "owner" | "member";

export type PaymentInterval = "monthly" | "quarterly" | "yearly" | "once";

export type ReminderStatus = "upcoming" | "due" | "completed";

export type ReminderPriority = "low" | "medium" | "high";

export type HomeCategory =
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

export type ContractCategory =
  | "electricity"
  | "internet"
  | "mobile"
  | "insurance"
  | "streaming"
  | "membership"
  | "software"
  | "other";

export type DocumentType =
  | "invoice"
  | "contract"
  | "manual"
  | "warranty"
  | "insurance"
  | "certificate"
  | "receipt"
  | "other";

export interface User {
  id: ID;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Household {
  id: ID;
  name: string;
  createdAt: string;
}

export interface HouseholdMember {
  id: ID;
  householdId: ID;
  userId: ID;
  role: HouseholdRole;
  joinedAt: string;
}

export interface HomeItem {
  id: ID;
  householdId: ID;
  name: string;
  category: HomeCategory;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  location?: string;
  purchaseDate?: string;
  installationDate?: string;
  purchasePriceCents?: number;
  warrantyEndDate?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: ID;
  householdId: ID;
  name: string;
  provider: string;
  category: ContractCategory;
  costCents?: number;
  paymentInterval?: PaymentInterval;
  startDate?: string;
  minimumTermMonths?: number;
  noticePeriodDays?: number;
  nextCancellationDate?: string;
  contractEndDate?: string;
  autoRenewal: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: ID;
  householdId: ID;
  title: string;
  type: DocumentType;
  fileName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  storagePath?: string;
  externalUrl?: string;
  homeItemId?: ID;
  contractId?: ID;
  issuedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: ID;
  householdId: ID;
  title: string;
  dueDate: string;
  status: ReminderStatus;
  priority: ReminderPriority;
  homeItemId?: ID;
  contractId?: ID;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type EntityType = "home_item" | "contract" | "document" | "reminder";

export interface HouseholdDataSnapshot {
  user: User;
  household: Household;
  members: HouseholdMember[];
  homeItems: HomeItem[];
  contracts: Contract[];
  documents: Document[];
  reminders: Reminder[];
}
