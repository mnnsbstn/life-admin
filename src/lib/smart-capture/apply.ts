import {
  contractSchema,
  type ContractFormValues,
} from "@/features/contracts/schemas/contract.schema";
import {
  documentSchema,
  type DocumentFormValues,
} from "@/features/documents/schemas/document.schema";
import {
  reminderSchema,
  type ReminderFormValues,
} from "@/features/reminders/schemas/reminder.schema";
import { resolveNextCancellationDate } from "@/lib/domain/contract-dates";
import { withDerivedReminderStatus } from "@/lib/domain/reminder-status";
import type { DocumentLinkTarget, PaymentInterval, ReminderLink } from "@/lib/domain/types";
import { emptyToUndefined, parseEuroToCents, parseOptionalInt } from "@/lib/forms/parse";
import { getRepositories } from "@/lib/repositories";
import {
  mapContractRow,
  mapContractToRow,
  type ContractRow,
} from "@/lib/repositories/supabase/mappers/contract";
import {
  mapDocumentRow,
  mapDocumentToRow,
  type DocumentRow,
} from "@/lib/repositories/supabase/mappers/document";
import {
  mapReminderRow,
  mapReminderToRow,
  type ReminderRow,
} from "@/lib/repositories/supabase/mappers/reminder";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { shouldUseSupabaseBackend } from "@/lib/supabase/env";
import type { SmartCaptureResult } from "@/lib/smart-capture/types";

export type SmartCaptureApplyTarget = "reminder" | "document" | "contract";
export type SmartCaptureApplyMode = true | "auto" | SmartCaptureApplyTarget;

export interface SmartCaptureApplied {
  kind: SmartCaptureApplyTarget;
  id: string;
}

function reminderDefaults(partial?: Partial<ReminderFormValues>): ReminderFormValues {
  return {
    title: partial?.title?.trim() || "Eingang — Frist",
    dueDate: partial?.dueDate?.trim() || new Date().toISOString().slice(0, 10),
    priority: partial?.priority ?? "medium",
    linkType: partial?.linkType ?? "standalone",
    linkTargetId: partial?.linkTargetId ?? "",
    notes: partial?.notes ?? "",
  };
}

function contractDefaults(partial?: Partial<ContractFormValues>): ContractFormValues {
  return {
    name: partial?.name?.trim() || "Eingang — Vertrag",
    provider: partial?.provider?.trim() || "Anbieter",
    category: partial?.category ?? "other",
    costEuro: partial?.costEuro ?? "",
    paymentInterval: partial?.paymentInterval ?? "",
    startDate: partial?.startDate ?? "",
    minimumTermMonths: partial?.minimumTermMonths ?? "",
    noticePeriodDays: partial?.noticePeriodDays ?? "",
    nextCancellationDate: partial?.nextCancellationDate ?? "",
    contractEndDate: partial?.contractEndDate ?? "",
    autoRenewal: partial?.autoRenewal ?? true,
    notes: partial?.notes ?? "",
  };
}

function documentDefaults(partial?: Partial<DocumentFormValues>): DocumentFormValues {
  const title = partial?.title?.trim() || "Eingang — Dokument";
  return {
    title,
    documentType: partial?.documentType ?? "other",
    issuedAt: partial?.issuedAt ?? "",
    mockFileName: partial?.mockFileName?.trim() || `${title.toLowerCase().replace(/\s+/g, "-")}.pdf`,
    linkType: partial?.linkType ?? "none",
    linkTargetId: partial?.linkTargetId ?? "",
    notes: partial?.notes ?? "",
  };
}

export function pickSmartCaptureApplyTarget(
  result: SmartCaptureResult,
  mode: SmartCaptureApplyMode,
): SmartCaptureApplyTarget | null {
  if (mode === "reminder" || mode === "document" || mode === "contract") {
    return result[mode] ? mode : null;
  }

  if (result.reminder?.dueDate) return "reminder";
  if (result.document?.title) return "document";
  if (result.contract?.name) return "contract";
  return null;
}

function toReminderLink(values: ReminderFormValues): ReminderLink {
  if (values.linkType === "home_item" && values.linkTargetId) {
    return { type: "home_item", id: values.linkTargetId };
  }
  if (values.linkType === "contract" && values.linkTargetId) {
    return { type: "contract", id: values.linkTargetId };
  }
  return { type: "standalone" };
}

function toDocumentLink(values: DocumentFormValues): DocumentLinkTarget {
  if (values.linkType === "home_item" && values.linkTargetId) {
    return { type: "home_item", id: values.linkTargetId };
  }
  if (values.linkType === "contract" && values.linkTargetId) {
    return { type: "contract", id: values.linkTargetId };
  }
  return { type: "none" };
}

function contractEntity(values: ContractFormValues, householdId: string) {
  const costCents = parseEuroToCents(values.costEuro);
  const paymentInterval = values.paymentInterval
    ? (values.paymentInterval as PaymentInterval)
    : undefined;
  const startDate = emptyToUndefined(values.startDate);
  const minimumTermMonths = parseOptionalInt(values.minimumTermMonths);
  const noticePeriodDays = parseOptionalInt(values.noticePeriodDays);
  const nextCancellationDate =
    emptyToUndefined(values.nextCancellationDate) ??
    resolveNextCancellationDate({
      startDate,
      minimumTermMonths,
      noticePeriodDays,
    });

  return {
    householdId,
    name: values.name,
    provider: values.provider,
    category: values.category,
    costCents,
    currency: costCents ? ("EUR" as const) : undefined,
    paymentInterval,
    startDate,
    minimumTermMonths,
    noticePeriodDays,
    nextCancellationDate,
    contractEndDate: emptyToUndefined(values.contractEndDate),
    autoRenewal: values.autoRenewal,
    notes: emptyToUndefined(values.notes),
  };
}

export async function applySmartCaptureToHousehold(
  householdId: string,
  result: SmartCaptureResult,
  mode: SmartCaptureApplyMode,
): Promise<SmartCaptureApplied> {
  const target = pickSmartCaptureApplyTarget(result, mode);
  if (!target) {
    throw new Error("no-apply-target");
  }

  const household = await getRepositories().households.getById(householdId);
  if (!household) {
    throw new Error("household-not-found");
  }

  if (target === "reminder") {
    const parsed = reminderSchema.parse(reminderDefaults(result.reminder));
    const link = toReminderLink(parsed);
    const base = {
      householdId,
      title: parsed.title,
      dueDate: parsed.dueDate,
      priority: parsed.priority,
      link,
      notes: emptyToUndefined(parsed.notes),
    };
    const entity = withDerivedReminderStatus({
      ...base,
      id: "temp",
      createdAt: "",
      updatedAt: "",
      status: "upcoming",
    });

    if (shouldUseSupabaseBackend()) {
      const admin = createSupabaseAdminClient();
      if (!admin) throw new Error("service-role-required");
      const { data, error } = await admin
        .from("reminders")
        .insert(mapReminderToRow(entity))
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return { kind: "reminder", id: mapReminderRow(data as ReminderRow).id };
    }

    const created = await getRepositories().reminders.create(entity);
    return { kind: "reminder", id: created.id };
  }

  if (target === "contract") {
    const parsed = contractSchema.parse(contractDefaults(result.contract));
    const payload = contractEntity(parsed, householdId);

    if (shouldUseSupabaseBackend()) {
      const admin = createSupabaseAdminClient();
      if (!admin) throw new Error("service-role-required");
      const { data, error } = await admin
        .from("contracts")
        .insert(mapContractToRow(payload))
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return { kind: "contract", id: mapContractRow(data as ContractRow).id };
    }

    const created = await getRepositories().contracts.create(payload);
    return { kind: "contract", id: created.id };
  }

  const parsed = documentSchema.parse(documentDefaults(result.document));
  const title = parsed.title;
  const docEntity = {
    householdId,
    title,
    documentType: parsed.documentType,
    issuedAt: emptyToUndefined(parsed.issuedAt),
    mockFileName: emptyToUndefined(parsed.mockFileName) ?? `${title.toLowerCase().replace(/\s+/g, "-")}.pdf`,
    mockFileSizeBytes: shouldUseSupabaseBackend() ? undefined : 100_000,
    link: toDocumentLink(parsed),
    notes: emptyToUndefined(parsed.notes),
  };

  if (shouldUseSupabaseBackend()) {
    const admin = createSupabaseAdminClient();
    if (!admin) throw new Error("service-role-required");
    const { data, error } = await admin
      .from("documents")
      .insert(mapDocumentToRow(docEntity))
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { kind: "document", id: mapDocumentRow(data as DocumentRow).id };
  }

  const created = await getRepositories().documents.create(docEntity);
  return { kind: "document", id: created.id };
}
