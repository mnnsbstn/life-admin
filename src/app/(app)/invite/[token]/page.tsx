import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AcceptInvitationButton } from "@/features/settings/components/accept-invitation-button";
import { Button } from "@/components/ui/button";
import { getAppSession } from "@/lib/auth/session";
import { getRepositories } from "@/lib/repositories";
import { formatDisplayDate } from "@/lib/format/date";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({
  params,
}: InvitePageProps): Promise<Metadata> {
  const { token } = await params;
  const invite = await getRepositories().households.getInvitationByToken(token);
  return {
    title: invite
      ? `Einladung: ${invite.householdName}`
      : "Einladung ungültig",
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const invite = await getRepositories().households.getInvitationByToken(token);
  if (!invite) notFound();

  const session = await getAppSession();
  const emailMatches =
    session.user.email.toLowerCase() === invite.invitation.email.toLowerCase();

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 py-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Haushaltseinladung</h1>
        <p className="text-sm text-muted-foreground">
          Du wurdest eingeladen, dem Haushalt{" "}
          <span className="font-medium text-foreground">
            {invite.householdName}
          </span>{" "}
          beizutreten.
        </p>
      </div>

      <dl className="grid gap-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">E-Mail</dt>
          <dd>{invite.invitation.email}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Rolle</dt>
          <dd>{invite.invitation.role}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Gültig bis</dt>
          <dd>{formatDisplayDate(invite.invitation.expiresAt.slice(0, 10))}</dd>
        </div>
      </dl>

      {emailMatches ? (
        <AcceptInvitationButton token={token} />
      ) : (
        <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/40">
          <p>
            Angemeldet als <strong>{session.user.email}</strong>. Diese Einladung
            gilt für <strong>{invite.invitation.email}</strong>.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/profile">Profil / Abmelden</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
