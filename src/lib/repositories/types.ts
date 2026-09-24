import type {
  Contract,
  Document,
  HomeItem,
  Household,
  Reminder,
  User,
  UUID,
} from "@/lib/domain/types";

export interface ListFilters {
  householdId: UUID;
}

export interface UserRepository {
  getCurrentUser(): Promise<User>;
}

export interface HouseholdRepository {
  getById(id: UUID): Promise<Household | null>;
  getForUser(userId: UUID): Promise<Household[]>;
}

export interface HomeItemRepository {
  list(filters: ListFilters): Promise<HomeItem[]>;
  getById(id: UUID): Promise<HomeItem | null>;
  create(item: Omit<HomeItem, "id" | "createdAt" | "updatedAt">): Promise<HomeItem>;
  update(id: UUID, patch: Partial<HomeItem>): Promise<HomeItem>;
}

export interface ContractRepository {
  list(filters: ListFilters): Promise<Contract[]>;
  getById(id: UUID): Promise<Contract | null>;
  create(
    item: Omit<Contract, "id" | "createdAt" | "updatedAt">,
  ): Promise<Contract>;
  update(id: UUID, patch: Partial<Contract>): Promise<Contract>;
}

export interface DocumentRepository {
  list(filters: ListFilters): Promise<Document[]>;
  getById(id: UUID): Promise<Document | null>;
  create(
    item: Omit<Document, "id" | "createdAt" | "updatedAt">,
  ): Promise<Document>;
  update(id: UUID, patch: Partial<Document>): Promise<Document>;
}

export interface ReminderRepository {
  list(filters: ListFilters): Promise<Reminder[]>;
  getById(id: UUID): Promise<Reminder | null>;
  create(
    item: Omit<Reminder, "id" | "createdAt" | "updatedAt">,
  ): Promise<Reminder>;
  update(id: UUID, patch: Partial<Reminder>): Promise<Reminder>;
}

export interface Repositories {
  users: UserRepository;
  households: HouseholdRepository;
  homeItems: HomeItemRepository;
  contracts: ContractRepository;
  documents: DocumentRepository;
  reminders: ReminderRepository;
}
