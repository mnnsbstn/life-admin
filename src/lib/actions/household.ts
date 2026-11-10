"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  writeActiveHouseholdId,
} from "@/lib/auth/active-household";
import { getAppSession } from "@/lib/auth/session";
import { revalidateLifeAdminCore } from "@/lib/actions/revalidate";
import { getRepositories } from "@/lib/repositories";

const householdNameSchema = z.object({
  name: z.string().trim().min(1, "Name erforderlich").max(120),
});

const invitationSchema = z.object({
  email: z.string().trim().email("Ungültige E-Mail"),
  role: z.enum(["member", "viewer"]),
});

async function requireOwner(householdId: string, userId: string) {
  const role = await getRepositories().households.getMemberRole(
    householdId,
    userId,
  );
  if (role !== "owner") {
    throw new Error("Nur Haushalts-Owner dürfen das.");
  }
}

export async function updateHouseholdNameAction(formData: FormData) {
  const parsed = householdNameSchema.parse({
    name: formData.get("name"),
  });
  const { householdId, userId } = await getAppSession();
  await requireOwner(householdId, userId);

  await getRepositories().households.update(householdId, {
    name: parsed.name,
  });

  revalidateLifeAdminCore();
  revalidatePath("/settings");
}

export async function createHouseholdInvitationAction(formData: FormData) {
  const parsed = invitationSchema.parse({
    email: formData.get("email"),
    role: formData.get("role"),
  });
  const { householdId, userId } = await getAppSession();
  await requireOwner(householdId, userId);

  await getRepositories().households.createInvitation({
    householdId,
    email: parsed.email,
    role: parsed.role,
    createdByUserId: userId,
  });

  revalidatePath("/settings");
}

export async function revokeHouseholdInvitationAction(invitationId: string) {
  const { householdId, userId } = await getAppSession();
  await requireOwner(householdId, userId);

  await getRepositories().households.revokeInvitation(invitationId);
  revalidatePath("/settings");
}

export async function acceptHouseholdInvitationAction(token: string) {
  const { userId } = await getAppSession();
  const householdId = await getRepositories().households.acceptInvitation(
    token,
    userId,
  );

  await writeActiveHouseholdId(householdId);
  revalidateLifeAdminCore();
  redirect(`/settings?joined=${householdId}`);
}

export async function switchActiveHouseholdAction(householdId: string) {
  const repos = getRepositories();
  const user = await repos.users.getCurrentUser();
  const households = await repos.households.getForUser(user.id);

  if (!households.some((h) => h.id === householdId)) {
    throw new Error("Du bist nicht Mitglied dieses Haushalts.");
  }

  await writeActiveHouseholdId(householdId);
  revalidateLifeAdminCore();
  revalidatePath("/settings");
  revalidatePath("/", "layout");
  redirect("/today");
}
