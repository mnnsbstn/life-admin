import { addDays, subDays, subMonths } from "date-fns";
import type { MockStoreData } from "./store";
import { DEMO_HOUSEHOLD_ID, DEMO_USER_ID } from "./store";

function isoNow(): string {
  return new Date().toISOString();
}

function dateOnly(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function dt(d: Date): string {
  return d.toISOString();
}

export function createSeedData(): MockStoreData {
  const now = new Date();
  const in12Days = addDays(now, 12);
  const in25Days = addDays(now, 25);
  const in5Days = addDays(now, 5);
  const yesterday = subDays(now, 1);
  const twoDaysAgo = subDays(now, 2);
  const contractStart = subMonths(now, 14);

  const homeHeating = "home-heating";
  const homeWasher = "home-washer";
  const homeDish = "home-dish";
  const homeRouter = "home-router";

  const contractPower = "contract-power";
  const contractFiber = "contract-fiber";
  const contractInsurance = "contract-insurance";
  const contractMobile = "contract-mobile";

  return {
    users: [
      {
        id: DEMO_USER_ID,
        email: "alex@example.com",
        displayName: "Alex",
        avatarUrl: null,
        createdAt: dt(subMonths(now, 6)),
      },
    ],
    households: [
      {
        id: DEMO_HOUSEHOLD_ID,
        name: "Mein Haushalt",
        createdAt: dt(subMonths(now, 6)),
      },
    ],
    householdMembers: [
      {
        id: "hm-001",
        householdId: DEMO_HOUSEHOLD_ID,
        userId: DEMO_USER_ID,
        role: "owner",
        joinedAt: dt(subMonths(now, 6)),
      },
    ],
    homeItems: [
      {
        id: homeHeating,
        householdId: DEMO_HOUSEHOLD_ID,
        name: "Heating System",
        category: "heating",
        manufacturer: "Viessmann",
        model: "Vitodens 200-W",
        serialNumber: "VIE-88421",
        location: "Utility room",
        installationDate: dateOnly(subMonths(now, 36)),
        warrantyEndsAt: dateOnly(in25Days),
        lastMaintenanceAt: dateOnly(subMonths(now, 11)),
        nextMaintenanceAt: dateOnly(in12Days),
        notes: "Annual service by local HVAC partner.",
        createdAt: dt(subMonths(now, 36)),
        updatedAt: isoNow(),
      },
      {
        id: homeWasher,
        householdId: DEMO_HOUSEHOLD_ID,
        name: "Washing Machine",
        category: "appliances",
        manufacturer: "Miele",
        model: "W1 WGB020",
        serialNumber: "MIE-552901",
        location: "Laundry room",
        purchaseDate: dateOnly(subMonths(now, 20)),
        purchasePrice: 899,
        currency: "EUR",
        warrantyEndsAt: dateOnly(addDays(now, 45)),
        notes: "Energy label A.",
        createdAt: dt(subMonths(now, 20)),
        updatedAt: isoNow(),
      },
      {
        id: homeDish,
        householdId: DEMO_HOUSEHOLD_ID,
        name: "Dishwasher",
        category: "appliances",
        manufacturer: "Bosch",
        model: "Serie 4 SMS46KI03E",
        location: "Kitchen",
        purchaseDate: dateOnly(subMonths(now, 30)),
        createdAt: dt(subMonths(now, 30)),
        updatedAt: isoNow(),
      },
      {
        id: homeRouter,
        householdId: DEMO_HOUSEHOLD_ID,
        name: "Internet Router",
        category: "internet",
        manufacturer: "AVM",
        model: "FRITZ!Box 7530 AX",
        location: "Living room",
        installationDate: dateOnly(subMonths(now, 8)),
        createdAt: dt(subMonths(now, 8)),
        updatedAt: isoNow(),
      },
    ],
    contracts: [
      {
        id: contractPower,
        householdId: DEMO_HOUSEHOLD_ID,
        name: "Strom Grundversorgung",
        provider: "Stadtwerke München",
        category: "electricity",
        cost: 78.5,
        costInterval: "monthly",
        startDate: dateOnly(contractStart),
        minimumTermMonths: 12,
        noticePeriodDays: 28,
        autoRenewal: true,
        renewalPeriodMonths: 12,
        notes: "Check renewal prices each year.",
        createdAt: dt(contractStart),
        updatedAt: isoNow(),
      },
      {
        id: contractFiber,
        householdId: DEMO_HOUSEHOLD_ID,
        name: "Glasfaser Internet",
        provider: "Telekom",
        category: "internet",
        cost: 49.95,
        costInterval: "monthly",
        startDate: dateOnly(subMonths(now, 8)),
        minimumTermMonths: 24,
        noticePeriodDays: 30,
        autoRenewal: true,
        renewalPeriodMonths: 12,
        createdAt: dt(subMonths(now, 8)),
        updatedAt: isoNow(),
      },
      {
        id: contractInsurance,
        householdId: DEMO_HOUSEHOLD_ID,
        name: "Hausratversicherung",
        provider: "Allianz",
        category: "insurance",
        cost: 156,
        costInterval: "yearly",
        startDate: dateOnly(subMonths(now, 3)),
        minimumTermMonths: 12,
        noticePeriodDays: 90,
        autoRenewal: true,
        renewalPeriodMonths: 12,
        notes: "No contract PDF linked yet.",
        createdAt: dt(subMonths(now, 3)),
        updatedAt: isoNow(),
      },
      {
        id: contractMobile,
        householdId: DEMO_HOUSEHOLD_ID,
        name: "Mobilfunk",
        provider: "O2",
        category: "mobile",
        cost: 29.99,
        costInterval: "monthly",
        startDate: dateOnly(subMonths(now, 5)),
        minimumTermMonths: 24,
        noticePeriodDays: 30,
        autoRenewal: false,
        createdAt: dt(subMonths(now, 5)),
        updatedAt: isoNow(),
      },
    ],
    documents: [
      {
        id: "doc-heating-invoice",
        householdId: DEMO_HOUSEHOLD_ID,
        title: "Heizungs-Rechnung 2025",
        type: "invoice",
        homeItemId: homeHeating,
        fileName: "heizung-rechnung-2025.pdf",
        mimeType: "application/pdf",
        sizeBytes: 245_000,
        storagePath: null,
        issuedAt: dateOnly(subMonths(now, 2)),
        createdAt: dt(subMonths(now, 2)),
        updatedAt: isoNow(),
      },
      {
        id: "doc-washer-warranty",
        householdId: DEMO_HOUSEHOLD_ID,
        title: "Waschmaschinen-Garantie",
        type: "warranty",
        homeItemId: homeWasher,
        fileName: "miele-garantie.pdf",
        mimeType: "application/pdf",
        sizeBytes: 512_000,
        storagePath: null,
        issuedAt: dateOnly(subMonths(now, 20)),
        createdAt: dt(subMonths(now, 20)),
        updatedAt: isoNow(),
      },
      {
        id: "doc-fiber-contract",
        householdId: DEMO_HOUSEHOLD_ID,
        title: "Internet-Vertrag Telekom",
        type: "contract",
        contractId: contractFiber,
        fileName: "telekom-glasfaser.pdf",
        mimeType: "application/pdf",
        sizeBytes: 890_000,
        storagePath: null,
        issuedAt: dateOnly(subMonths(now, 8)),
        createdAt: dt(subMonths(now, 8)),
        updatedAt: isoNow(),
      },
    ],
    reminders: [
      {
        id: "rem-heating-service",
        householdId: DEMO_HOUSEHOLD_ID,
        title: "Heizungswartung terminieren",
        dueDate: dateOnly(in5Days),
        status: "upcoming",
        priority: "high",
        homeItemId: homeHeating,
        notes: "Preferred vendor: Müller Haustechnik.",
        createdAt: dt(subMonths(now, 1)),
        updatedAt: isoNow(),
      },
      {
        id: "rem-power-review",
        householdId: DEMO_HOUSEHOLD_ID,
        title: "Stromvertrag prüfen",
        dueDate: dateOnly(yesterday),
        status: "due",
        priority: "medium",
        contractId: contractPower,
        createdAt: dt(subMonths(now, 2)),
        updatedAt: isoNow(),
      },
      {
        id: "rem-washer-warranty",
        householdId: DEMO_HOUSEHOLD_ID,
        title: "Garantie Waschmaschine dokumentieren",
        dueDate: dateOnly(twoDaysAgo),
        status: "due",
        priority: "low",
        homeItemId: homeWasher,
        createdAt: dt(subMonths(now, 1)),
        updatedAt: isoNow(),
      },
    ],
  };
}
