import type {
  CalendarProvider,
  CalendarSyncedEvent,
  Contract,
  Document,
  FamilyMember,
  FinancialAccount,
  HomeItem,
  Household,
  HouseholdInvitation,
  HouseholdMemberRole,
  HouseholdMemberView,
  Reminder,
  User,
  UserCalendarConnection,
  UUID,
  Vehicle,
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
  update(id: UUID, patch: Partial<Pick<Household, "name">>): Promise<Household>;
  getMemberRole(
    householdId: UUID,
    userId: UUID,
  ): Promise<HouseholdMemberRole | null>;
  listMembers(householdId: UUID): Promise<HouseholdMemberView[]>;
  listInvitations(householdId: UUID): Promise<HouseholdInvitation[]>;
  createInvitation(input: {
    householdId: UUID;
    email: string;
    role: HouseholdInvitation["role"];
    createdByUserId: UUID;
  }): Promise<HouseholdInvitation>;
  revokeInvitation(id: UUID): Promise<void>;
  acceptInvitation(token: string, userId: UUID): Promise<UUID>;
  getInvitationByToken(token: string): Promise<{
    invitation: HouseholdInvitation;
    householdName: string;
  } | null>;
}

export interface HomeItemRepository {
  list(filters: ListFilters): Promise<HomeItem[]>;
  getById(id: UUID): Promise<HomeItem | null>;
  create(item: Omit<HomeItem, "id" | "createdAt" | "updatedAt">): Promise<HomeItem>;
  update(id: UUID, patch: Partial<HomeItem>): Promise<HomeItem>;
  delete(id: UUID): Promise<void>;
}

export interface ContractRepository {
  list(filters: ListFilters): Promise<Contract[]>;
  getById(id: UUID): Promise<Contract | null>;
  create(
    item: Omit<Contract, "id" | "createdAt" | "updatedAt">,
  ): Promise<Contract>;
  update(id: UUID, patch: Partial<Contract>): Promise<Contract>;
  delete(id: UUID): Promise<void>;
}

export interface DocumentRepository {
  list(filters: ListFilters): Promise<Document[]>;
  getById(id: UUID): Promise<Document | null>;
  create(
    item: Omit<Document, "id" | "createdAt" | "updatedAt">,
  ): Promise<Document>;
  update(id: UUID, patch: Partial<Document>): Promise<Document>;
  delete(id: UUID): Promise<void>;
}

export interface ReminderRepository {
  list(filters: ListFilters): Promise<Reminder[]>;
  getById(id: UUID): Promise<Reminder | null>;
  create(
    item: Omit<Reminder, "id" | "createdAt" | "updatedAt">,
  ): Promise<Reminder>;
  update(id: UUID, patch: Partial<Reminder>): Promise<Reminder>;
  delete(id: UUID): Promise<void>;
}

export interface VehicleRepository {
  list(filters: ListFilters): Promise<Vehicle[]>;
  getById(id: UUID): Promise<Vehicle | null>;
  create(
    item: Omit<Vehicle, "id" | "createdAt" | "updatedAt">,
  ): Promise<Vehicle>;
  update(id: UUID, patch: Partial<Vehicle>): Promise<Vehicle>;
  delete(id: UUID): Promise<void>;
}

export interface FinancialAccountRepository {
  list(filters: ListFilters): Promise<FinancialAccount[]>;
  getById(id: UUID): Promise<FinancialAccount | null>;
  create(
    item: Omit<FinancialAccount, "id" | "createdAt" | "updatedAt">,
  ): Promise<FinancialAccount>;
  update(id: UUID, patch: Partial<FinancialAccount>): Promise<FinancialAccount>;
  delete(id: UUID): Promise<void>;
}

export interface FamilyMemberRepository {
  list(filters: ListFilters): Promise<FamilyMember[]>;
  getById(id: UUID): Promise<FamilyMember | null>;
  create(
    item: Omit<FamilyMember, "id" | "createdAt" | "updatedAt">,
  ): Promise<FamilyMember>;
  update(id: UUID, patch: Partial<FamilyMember>): Promise<FamilyMember>;
  delete(id: UUID): Promise<void>;
}

export interface CalendarIntegrationRepository {
  getConnection(
    userId: UUID,
    provider: CalendarProvider,
  ): Promise<UserCalendarConnection | null>;
  upsertConnection(
    connection: Omit<UserCalendarConnection, "id" | "createdAt" | "updatedAt"> & {
      id?: UUID;
    },
  ): Promise<UserCalendarConnection>;
  deleteConnection(userId: UUID, provider: CalendarProvider): Promise<void>;
  updateAccessToken(
    userId: UUID,
    provider: CalendarProvider,
    accessToken: string,
    expiresAt: string,
  ): Promise<void>;
  getSyncedEvent(
    userId: UUID,
    provider: CalendarProvider,
    sourceKind: string,
    sourceId: string,
  ): Promise<CalendarSyncedEvent | null>;
  recordSyncedEvent(
    row: Omit<CalendarSyncedEvent, "id" | "createdAt"> & { id?: UUID },
  ): Promise<CalendarSyncedEvent>;
}

export interface Repositories {
  users: UserRepository;
  households: HouseholdRepository;
  calendarIntegrations: CalendarIntegrationRepository;
  homeItems: HomeItemRepository;
  contracts: ContractRepository;
  documents: DocumentRepository;
  reminders: ReminderRepository;
  vehicles: VehicleRepository;
  financialAccounts: FinancialAccountRepository;
  familyMembers: FamilyMemberRepository;
}
