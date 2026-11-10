import { buildInviteUrl as buildInviteUrlFromOrigin } from "@/lib/app-origin";

export function buildInviteUrl(appOrigin: string, token: string): string {
  return buildInviteUrlFromOrigin(appOrigin, token);
}
import type { HouseholdInvitation } from "@/lib/domain/types";

const RESEND_API = "https://api.resend.com/emails";

export function isInvitationEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.INVITATION_EMAIL_FROM?.trim(),
  );
}

export type InvitationEmailPayload = {
  to: string;
  inviteUrl: string;
  householdName: string;
  inviterDisplayName: string;
  role: HouseholdInvitation["role"];
  expiresAt: string;
};

export function buildInvitationEmailContent(
  payload: InvitationEmailPayload,
): { subject: string; text: string; html: string } {
  const roleLabel = payload.role === "viewer" ? "Betrachter" : "Mitglied";
  const subject = `Einladung zu ${payload.householdName} — Life Admin`;

  const text = [
    `Hallo,`,
    ``,
    `${payload.inviterDisplayName} lädt dich ein, dem Haushalt „${payload.householdName}“ in Life Admin als ${roleLabel} beizutreten.`,
    ``,
    `Einladung annehmen:`,
    payload.inviteUrl,
    ``,
    `Die Einladung gilt bis ${payload.expiresAt.slice(0, 10)}.`,
    ``,
    `Falls du noch kein Konto hast, registriere dich mit derselben E-Mail-Adresse und öffne den Link erneut.`,
  ].join("\n");

  const html = `
    <p>Hallo,</p>
    <p><strong>${escapeHtml(payload.inviterDisplayName)}</strong> lädt dich ein,
    dem Haushalt <strong>${escapeHtml(payload.householdName)}</strong> in Life Admin
    als ${escapeHtml(roleLabel)} beizutreten.</p>
    <p><a href="${escapeHtml(payload.inviteUrl)}">Einladung annehmen</a></p>
    <p style="color:#666;font-size:14px;">Gültig bis ${escapeHtml(payload.expiresAt.slice(0, 10))}.<br/>
    Ohne Konto: mit derselben E-Mail registrieren und Link erneut öffnen.</p>
  `.trim();

  return { subject, text, html };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendHouseholdInvitationEmail(
  payload: InvitationEmailPayload,
): Promise<void> {
  if (!isInvitationEmailConfigured()) {
    throw new Error("Invitation email is not configured");
  }

  const { subject, text, html } = buildInvitationEmailContent(payload);

  const response = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.INVITATION_EMAIL_FROM,
      to: [payload.to],
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend error (${response.status}): ${body.slice(0, 200)}`);
  }
}

export function invitationEmailPayload(
  input: Omit<InvitationEmailPayload, "inviteUrl"> & {
    appOrigin: string;
    token: string;
  },
): InvitationEmailPayload {
  return {
    ...input,
    inviteUrl: buildInviteUrl(input.appOrigin, input.token),
  };
}
