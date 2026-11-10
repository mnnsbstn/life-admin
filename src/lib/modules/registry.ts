export const lifeAdminModules = [
  { id: "today", label: "Today", enabled: true },
  { id: "home", label: "Home", enabled: true },
  { id: "contracts", label: "Contracts", enabled: true },
  { id: "documents", label: "Documents", enabled: true },
  { id: "reminders", label: "Reminders", enabled: true },
  { id: "vehicles", label: "Vehicles", enabled: true },
  { id: "money", label: "Money", enabled: true },
  { id: "family", label: "Family", enabled: true },
] as const;

export type LifeAdminModuleId = (typeof lifeAdminModules)[number]["id"];
