"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";

import { resolveAppOrigin } from "@/lib/app-origin";
import {
  writeActiveHouseholdId,
} from "@/lib/auth/active-household";
import { getAppSession } from "@/lib/auth/session";
import { revalidateLifeAdminCore } from "@/lib/actions/revalidate";
import {
  githubPagesAppOrigin,
  isStaticExportBuild,
} from "@/lib/deployment-mode";
import {
  invitationEmailPayload,
  isInvitationEmailConfigured,
  sendHouseholdInvitationEmail,
} from "@/lib/email/invitation-mailer";
import { getRepositories } from "@/lib/repositories";

export type CreateInvitationResult = {
  emailSent: boolean;
};

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

async function deliverInvitationEmail(
  invitation: { email: string; token: string; role: "member" | "viewer"; expiresAt: string },
  householdName: string,
  inviterDisplayName: string,
) {
  if (!isInvitationEmailConfigured()) {
    return false;
  }

  const appOrigin = isStaticExportBuild()
    ? githubPagesAppOrigin()
    : resolveAppOrigin(await headers());

  await sendHouseholdInvitationEmail(
    invitationEmailPayload({
      to: invitation.email,
      appOrigin,
      token: invitation.token,
      householdName,
      inviterDisplayName,
      role: invitation.role,
      expiresAt: invitation.expiresAt,
    }),
  );
  return true;
}

export async function createHouseholdInvitationAction(
  formData: FormData,
): Promise<CreateInvitationResult> {
  const parsed = invitationSchema.parse({
    email: formData.get("email"),
    role: formData.get("role"),
  });
  const session = await getAppSession();
  const { householdId, userId } = session;
  await requireOwner(householdId, userId);

  const invitation = await getRepositories().households.createInvitation({
    householdId,
    email: parsed.email,
    role: parsed.role,
    createdByUserId: userId,
  });

  let emailSent = false;
  try {
    emailSent = await deliverInvitationEmail(
      invitation,
      session.household.name,
      session.user.displayName,
    );
  } catch (error) {
    console.error("[life-admin] invitation email failed:", error);
  }

  revalidatePath("/settings");
  return { emailSent };
}

export async function sendHouseholdInvitationEmailAction(
  invitationId: string,
): Promise<{ emailSent: boolean }> {
  const session = await getAppSession();
  await requireOwner(session.householdId, session.userId);

  const invitations = await getRepositories().households.listInvitations(
    session.householdId,
  );
  const invitation = invitations.find((inv) => inv.id === invitationId);
  if (!invitation) {
    throw new Error("Einladung nicht gefunden.");
  }

  let emailSent = false;
  try {
    emailSent = await deliverInvitationEmail(
      invitation,
      session.household.name,
      session.user.displayName,
    );
  } catch (error) {
    console.error("[life-admin] invitation email resend failed:", error);
    throw error;
  }

  return { emailSent };
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
