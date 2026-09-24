"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { contractFormSchema } from "@/lib/domain/types/contract";
import { DEMO_HOUSEHOLD_ID, getRepositories } from "@/lib/repositories";

function parseContractForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return {
    ...raw,
    cost: raw.cost ? Number(raw.cost) : null,
    minimumTermMonths: raw.minimumTermMonths ? Number(raw.minimumTermMonths) : null,
    noticePeriodDays: raw.noticePeriodDays ? Number(raw.noticePeriodDays) : null,
    renewalPeriodMonths: raw.renewalPeriodMonths ? Number(raw.renewalPeriodMonths) : null,
    autoRenewal: raw.autoRenewal === "on" || raw.autoRenewal === "true",
  };
}

export async function createContractAction(formData: FormData) {
  const parsed = contractFormSchema.safeParse(parseContractForm(formData));
  if (!parsed.success) {
    return;
  }
  const item = getRepositories().contracts.create(DEMO_HOUSEHOLD_ID, parsed.data);
  revalidatePath("/contracts");
  revalidatePath("/today");
  redirect(`/contracts/${item.id}`);
}

export async function updateContractAction(id: string, formData: FormData) {
  const parsed = contractFormSchema.partial().safeParse(parseContractForm(formData));
  if (!parsed.success) {
    return;
  }
  getRepositories().contracts.update(id, parsed.data);
  revalidatePath("/contracts");
  revalidatePath(`/contracts/${id}`);
  revalidatePath("/today");
  redirect(`/contracts/${id}`);
}
