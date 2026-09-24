"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { homeItemFormSchema } from "@/lib/domain/types/home-item";
import { DEMO_HOUSEHOLD_ID, getRepositories } from "@/lib/repositories";

function normalizeForm(raw: Record<string, FormDataEntryValue>) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    out[key] = value === "" ? null : value;
  }
  return out;
}

export async function createHomeItemAction(formData: FormData) {
  const raw = normalizeForm(Object.fromEntries(formData.entries()));
  const parsed = homeItemFormSchema.safeParse({
    ...raw,
    purchasePrice: raw.purchasePrice ? Number(raw.purchasePrice) : null,
  });
  if (!parsed.success) {
    return;
  }
  const item = getRepositories().homeItems.create(DEMO_HOUSEHOLD_ID, parsed.data);
  revalidatePath("/home");
  revalidatePath("/today");
  redirect(`/home/${item.id}`);
}

export async function updateHomeItemAction(id: string, formData: FormData) {
  const raw = normalizeForm(Object.fromEntries(formData.entries()));
  const parsed = homeItemFormSchema.partial().safeParse({
    ...raw,
    purchasePrice: raw.purchasePrice ? Number(raw.purchasePrice) : null,
  });
  if (!parsed.success) {
    return;
  }
  getRepositories().homeItems.update(id, parsed.data);
  revalidatePath("/home");
  revalidatePath(`/home/${id}`);
  revalidatePath("/today");
  redirect(`/home/${id}`);
}
