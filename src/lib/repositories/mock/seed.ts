import { DEMO_HOUSEHOLD_ID, DEMO_USER_ID } from "@/lib/constants";
import type {
  Contract,
  Document,
  HomeItem,
  Household,
  HouseholdInvitation,
  HouseholdMember,
  Reminder,
  User,
} from "@/lib/domain/types";
import { SEED_IDS } from "@/lib/repositories/mock/ids";
import { STATIC_INVITE_DEMO_TOKEN } from "@/lib/static-export-params";

const now = "2026-09-24T08:00:00.000Z";

export const seedUser: User = {
  id: DEMO_USER_ID,
  email: "alex@example.com",
  displayName: "Alex",
  createdAt: "2024-01-15T10:00:00.000Z",
};

export const seedHousehold: Household = {
  id: DEMO_HOUSEHOLD_ID,
  name: "Wohnung Musterstraße 12",
  createdAt: "2024-01-15T10:00:00.000Z",
};

export const seedHouseholdMember: HouseholdMember = {
  id: SEED_IDS.householdMember,
  householdId: DEMO_HOUSEHOLD_ID,
  userId: DEMO_USER_ID,
  role: "owner",
  joinedAt: "2024-01-15T10:00:00.000Z",
};

export const seedHomeItems: HomeItem[] = [
  {
    id: SEED_IDS.homeItems.heating,
    householdId: DEMO_HOUSEHOLD_ID,
    name: "Heizungsanlage",
    category: "heating",
    manufacturer: "Viessmann",
    model: "Vitodens 200-W",
    serialNumber: "VD-2019-88421",
    location: "Keller, Technikraum",
    installationDate: "2019-11-12",
    purchasePriceCents: 890000,
    currency: "EUR",
    warrantyEndsAt: "2024-11-12",
    lastMaintenanceAt: "2025-10-03",
    nextMaintenanceAt: "2026-10-08",
    notes: "Jährliche Wartung durch Haustechnik Weber.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SEED_IDS.homeItems.washingMachine,
    householdId: DEMO_HOUSEHOLD_ID,
    name: "Waschmaschine",
    category: "appliances",
    manufacturer: "Bosch",
    model: "WAN28209",
    serialNumber: "BSH-WM-7721",
    location: "Bad",
    purchaseDate: "2024-09-20",
    purchasePriceCents: 69900,
    currency: "EUR",
    warrantyEndsAt: "2026-09-20",
    notes: "Energieeffizienz A, 9 kg.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SEED_IDS.homeItems.dishwasher,
    householdId: DEMO_HOUSEHOLD_ID,
    name: "Geschirrspüler",
    category: "kitchen",
    manufacturer: "Siemens",
    model: "SN65IX00CE",
    location: "Küche",
    purchaseDate: "2022-03-14",
    purchasePriceCents: 54900,
    currency: "EUR",
    warrantyEndsAt: "2024-03-14",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SEED_IDS.homeItems.router,
    householdId: DEMO_HOUSEHOLD_ID,
    name: "Internet-Router",
    category: "internet",
    manufacturer: "Telekom",
    model: "Speedport Smart 4",
    location: "Wohnzimmer",
    installationDate: "2023-06-01",
    notes: "Glasfaser-Anschluss, Mesh-fähig.",
    createdAt: now,
    updatedAt: now,
  },
];

export const seedContracts: Contract[] = [
  {
    id: SEED_IDS.contracts.electricity,
    householdId: DEMO_HOUSEHOLD_ID,
    name: "Strom Grundversorgung",
    provider: "Vattenfall",
    category: "electricity",
    costCents: 8900,
    currency: "EUR",
    paymentInterval: "monthly",
    startDate: "2025-01-01",
    minimumTermMonths: 12,
    noticePeriodDays: 30,
    nextCancellationDate: "2026-10-15",
    autoRenewal: true,
    notes: "Tarif prüfen, Preisgarantie endet Ende 2026.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SEED_IDS.contracts.internet,
    householdId: DEMO_HOUSEHOLD_ID,
    name: "Internet & Festnetz",
    provider: "Telekom",
    category: "internet",
    costCents: 4999,
    currency: "EUR",
    paymentInterval: "monthly",
    startDate: "2023-06-01",
    minimumTermMonths: 24,
    noticePeriodDays: 30,
    nextCancellationDate: "2026-10-03",
    autoRenewal: true,
    contractEndDate: "2027-05-31",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SEED_IDS.contracts.insurance,
    householdId: DEMO_HOUSEHOLD_ID,
    name: "Wohngebäudeversicherung",
    provider: "Allianz",
    category: "insurance",
    costCents: 42000,
    currency: "EUR",
    paymentInterval: "yearly",
    startDate: "2024-10-28",
    minimumTermMonths: 12,
    noticePeriodDays: 90,
    nextCancellationDate: "2026-07-30",
    autoRenewal: true,
    contractEndDate: "2026-10-28",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SEED_IDS.contracts.mobile,
    householdId: DEMO_HOUSEHOLD_ID,
    name: "Mobilfunk",
    provider: "O2",
    category: "mobile",
    costCents: 2999,
    currency: "EUR",
    paymentInterval: "monthly",
    startDate: "2025-03-01",
    minimumTermMonths: 24,
    noticePeriodDays: 30,
    autoRenewal: true,
    createdAt: now,
    updatedAt: now,
  },
];

export const seedDocuments: Document[] = [
  {
    id: SEED_IDS.documents.heatingInvoice,
    householdId: DEMO_HOUSEHOLD_ID,
    title: "Rechnung Heizungswartung 2025",
    documentType: "invoice",
    issuedAt: "2025-10-05",
    mockFileName: "heizung-wartung-2025.pdf",
    mockFileSizeBytes: 245_000,
    link: { type: "home_item", id: SEED_IDS.homeItems.heating },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SEED_IDS.documents.washingWarranty,
    householdId: DEMO_HOUSEHOLD_ID,
    title: "Garantie Waschmaschine",
    documentType: "warranty",
    issuedAt: "2024-09-20",
    mockFileName: "bosch-garantie-waschmaschine.pdf",
    mockFileSizeBytes: 128_000,
    link: { type: "home_item", id: SEED_IDS.homeItems.washingMachine },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SEED_IDS.documents.internetContract,
    householdId: DEMO_HOUSEHOLD_ID,
    title: "Internetvertrag Telekom",
    documentType: "contract",
    issuedAt: "2023-05-28",
    mockFileName: "telekom-internet-vertrag.pdf",
    mockFileSizeBytes: 512_000,
    link: { type: "contract", id: SEED_IDS.contracts.internet },
    createdAt: now,
    updatedAt: now,
  },
];

export const seedReminders: Reminder[] = [
  {
    id: SEED_IDS.reminders.heatingMaintenance,
    householdId: DEMO_HOUSEHOLD_ID,
    title: "Heizung warten",
    dueDate: "2026-10-08",
    status: "upcoming",
    priority: "high",
    link: { type: "home_item", id: SEED_IDS.homeItems.heating },
    notes: "Termin bei Haustechnik Weber anfragen.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SEED_IDS.reminders.electricityCheck,
    householdId: DEMO_HOUSEHOLD_ID,
    title: "Stromvertrag prüfen",
    dueDate: "2026-09-22",
    status: "due",
    priority: "medium",
    link: { type: "contract", id: SEED_IDS.contracts.electricity },
    notes: "Kündigungsfenster und Preisgarantie vergleichen.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SEED_IDS.reminders.warrantyExpiry,
    householdId: DEMO_HOUSEHOLD_ID,
    title: "Garantie Waschmaschine prüfen",
    dueDate: "2026-09-20",
    status: "due",
    priority: "low",
    link: { type: "home_item", id: SEED_IDS.homeItems.washingMachine },
    createdAt: now,
    updatedAt: now,
  },
];

export interface MockSeedData {
  user: User;
  household: Household;
  householdMember: HouseholdMember;
  invitations: HouseholdInvitation[];
  homeItems: HomeItem[];
  contracts: Contract[];
  documents: Document[];
  reminders: Reminder[];
}

export function createSeedData(): MockSeedData {
  return {
    user: structuredClone(seedUser),
    household: structuredClone(seedHousehold),
    householdMember: structuredClone(seedHouseholdMember),
    invitations: [
      {
        id: "88888888-8888-8888-8888-888888888801",
        householdId: DEMO_HOUSEHOLD_ID,
        email: "partner@example.com",
        role: "member",
        token: STATIC_INVITE_DEMO_TOKEN,
        expiresAt: "2027-12-31T23:59:59.000Z",
        createdAt: now,
      },
    ],
    homeItems: structuredClone(seedHomeItems),
    contracts: structuredClone(seedContracts),
    documents: structuredClone(seedDocuments),
    reminders: structuredClone(seedReminders),
  };
}
