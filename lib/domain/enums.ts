export const homeCategories = [
  "heating",
  "electricity",
  "water",
  "internet",
  "appliances",
  "other",
] as const;
export type HomeCategory = (typeof homeCategories)[number];

export const contractCategories = [
  "electricity",
  "internet",
  "mobile",
  "insurance",
  "other",
] as const;
export type ContractCategory = (typeof contractCategories)[number];

export const costIntervals = ["monthly", "yearly", "quarterly", "once"] as const;
export type CostInterval = (typeof costIntervals)[number];

export const documentTypes = [
  "invoice",
  "contract",
  "manual",
  "warranty",
  "other",
] as const;
export type DocumentType = (typeof documentTypes)[number];

export const reminderStatuses = ["upcoming", "due", "completed"] as const;
export type ReminderStatus = (typeof reminderStatuses)[number];

export const reminderPriorities = ["low", "medium", "high"] as const;
export type ReminderPriority = (typeof reminderPriorities)[number];

export const householdRoles = ["owner", "member", "viewer"] as const;
export type HouseholdRole = (typeof householdRoles)[number];

export const attentionSeverities = ["critical", "warning", "info"] as const;
export type AttentionSeverity = (typeof attentionSeverities)[number];

export const attentionKinds = [
  "warranty_ending",
  "maintenance_due",
  "cancellation_window",
  "renewal_soon",
  "reminder_due",
  "reminder_overdue",
  "document_missing",
] as const;
export type AttentionKind = (typeof attentionKinds)[number];
