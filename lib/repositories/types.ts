import type { HomeItem, HomeItemFormValues } from "@/lib/domain/types/home-item";
import type { Contract, ContractFormValues } from "@/lib/domain/types/contract";
import type { Document, DocumentFormValues } from "@/lib/domain/types/document";
import type { Reminder, ReminderFormValues } from "@/lib/domain/types/reminder";
import type { User } from "@/lib/domain/types/user";
import type { Household, HouseholdMember } from "@/lib/domain/types/household";

export type DataSource = "mock" | "supabase";

export interface IHomeItemRepository {
  list(householdId: string): HomeItem[];
  getById(id: string): HomeItem | undefined;
  create(householdId: string, data: HomeItemFormValues): HomeItem;
  update(id: string, data: Partial<HomeItemFormValues>): HomeItem | undefined;
  delete(id: string): boolean;
}

export interface IContractRepository {
  list(householdId: string): Contract[];
  getById(id: string): Contract | undefined;
  create(householdId: string, data: ContractFormValues): Contract;
  update(id: string, data: Partial<ContractFormValues>): Contract | undefined;
  delete(id: string): boolean;
}

export interface IDocumentRepository {
  list(householdId: string): Document[];
  getById(id: string): Document | undefined;
  create(householdId: string, data: DocumentFormValues): Document;
  update(id: string, data: Partial<DocumentFormValues>): Document | undefined;
  delete(id: string): boolean;
}

export interface IReminderRepository {
  list(householdId: string): Reminder[];
  getById(id: string): Reminder | undefined;
  create(householdId: string, data: ReminderFormValues): Reminder;
  update(id: string, data: Partial<ReminderFormValues>): Reminder | undefined;
  delete(id: string): boolean;
}

export interface IUserRepository {
  getDemoUser(): User;
}

export interface IHouseholdRepository {
  getDemoHousehold(): Household;
  getMembers(householdId: string): HouseholdMember[];
}

export interface Repositories {
  homeItems: IHomeItemRepository;
  contracts: IContractRepository;
  documents: IDocumentRepository;
  reminders: IReminderRepository;
  users: IUserRepository;
  households: IHouseholdRepository;
}
