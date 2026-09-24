import type {
  Contract,
  Document,
  HomeItem,
  Household,
  HouseholdDataSnapshot,
  HouseholdMember,
  ID,
  Reminder,
  User,
} from "@/lib/domain/types";
import type { HomeItemFormValues } from "@/lib/domain/schemas/home-item";
import type { ContractFormValues } from "@/lib/domain/schemas/contract";
import type { DocumentFormValues } from "@/lib/domain/schemas/document";
import type { ReminderFormValues } from "@/lib/domain/schemas/reminder";

export interface SessionContext {
  user: User;
  household: Household;
  members: HouseholdMember[];
}

export interface HouseholdRepository {
  getSession(): Promise<SessionContext>;
  getSnapshot(householdId: ID): Promise<HouseholdDataSnapshot>;
}

export interface HomeItemRepository {
  list(householdId: ID): Promise<HomeItem[]>;
  getById(id: ID): Promise<HomeItem | null>;
  create(householdId: ID, input: HomeItemFormValues): Promise<HomeItem>;
  update(id: ID, input: HomeItemFormValues): Promise<HomeItem>;
  remove(id: ID): Promise<void>;
}

export interface ContractRepository {
  list(householdId: ID): Promise<Contract[]>;
  getById(id: ID): Promise<Contract | null>;
  create(householdId: ID, input: ContractFormValues): Promise<Contract>;
  update(id: ID, input: ContractFormValues): Promise<Contract>;
  remove(id: ID): Promise<void>;
}

export interface DocumentRepository {
  list(householdId: ID): Promise<Document[]>;
  getById(id: ID): Promise<Document | null>;
  create(householdId: ID, input: DocumentFormValues): Promise<Document>;
  update(id: ID, input: DocumentFormValues): Promise<Document>;
  remove(id: ID): Promise<void>;
}

export interface ReminderRepository {
  list(householdId: ID): Promise<Reminder[]>;
  getById(id: ID): Promise<Reminder | null>;
  create(householdId: ID, input: ReminderFormValues): Promise<Reminder>;
  update(id: ID, input: ReminderFormValues): Promise<Reminder>;
  complete(id: ID): Promise<Reminder>;
  remove(id: ID): Promise<void>;
}

export interface Repositories {
  household: HouseholdRepository;
  homeItems: HomeItemRepository;
  contracts: ContractRepository;
  documents: DocumentRepository;
  reminders: ReminderRepository;
}
