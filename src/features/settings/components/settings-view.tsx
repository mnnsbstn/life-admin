import { Badge } from "@/components/ui/badge";
import {
  DetailField,
  DetailFieldList,
  DetailSection,
} from "@/components/domain/detail-section";
import { HouseholdInvitationsPanel } from "@/features/settings/components/household-invitations-panel";
import { HouseholdNameForm } from "@/features/settings/components/household-name-form";
import { HouseholdSwitcher } from "@/features/settings/components/household-switcher";
import type {
  Household,
  HouseholdInvitation,
  HouseholdMemberRole,
  HouseholdMemberView,
} from "@/lib/domain/types";
import { getRepositoryDiagnostics } from "@/lib/repositories";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";
import { getRuntimeDataBackendLabel } from "@/lib/supabase/env";
import { GoogleCalendarPanel } from "@/features/settings/components/google-calendar-panel";
import { HouseholdCalendarExport } from "@/features/settings/components/household-calendar-export";
import type { UserCalendarConnection } from "@/lib/domain/types";
import type { CalendarEventInput } from "@/lib/calendar/types";
import Link from "next/link";

interface SettingsViewProps {
  households: Household[];
  activeHouseholdId: string;
  householdName: string;
  members: HouseholdMemberView[];
  invitations: HouseholdInvitation[];
  memberRole: HouseholdMemberRole;
  appOrigin: string;
  invitationEmailEnabled: boolean;
  smartCaptureLlmEnabled: boolean;
  calendarEvents: CalendarEventInput[];
  feedHttpsUrl: string | null;
  feedWebcalUrl: string | null;
  calendarFeedSubscribeConfigured: boolean;
  googleCalendarOAuthConfigured: boolean;
  googleOAuthStateConfigured: boolean;
  googleCalendarConnection: UserCalendarConnection | null;
}

const roleLabels: Record<HouseholdMemberRole, string> = {
  owner: "Owner",
  member: "Mitglied",
  viewer: "Betrachter",
};

export function SettingsView({
  households,
  activeHouseholdId,
  householdName,
  members,
  invitations,
  memberRole,
  appOrigin,
  invitationEmailEnabled,
  smartCaptureLlmEnabled,
  calendarEvents,
  feedHttpsUrl,
  feedWebcalUrl,
  calendarFeedSubscribeConfigured,
  googleCalendarOAuthConfigured,
  googleOAuthStateConfigured,
  googleCalendarConnection,
}: SettingsViewProps) {
  const diagnostics = getRepositoryDiagnostics();
  const isOwner = memberRole === "owner";
  const readOnlyDemo = isGitHubPagesPreview();

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Einstellungen</h1>
        <p className="text-sm text-muted-foreground">
          Haushalt, Mitglieder und technischer Status (V0.2).
        </p>
      </div>

      <DetailSection title="Haushalt">
        {!readOnlyDemo ? (
          <div className="mb-6">
            <HouseholdSwitcher
              households={households}
              activeHouseholdId={activeHouseholdId}
            />
          </div>
        ) : null}
        <HouseholdNameForm
          defaultName={householdName}
          disabled={!isOwner || readOnlyDemo}
        />
        {!isOwner ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Nur Owner können den Haushaltsnamen ändern.
          </p>
        ) : null}
      </DetailSection>

      <DetailSection title="Mitglieder">
        <ul className="flex flex-col gap-2">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">{member.displayName}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <Badge variant="secondary" className="font-normal">
                {roleLabels[member.role]}
              </Badge>
            </li>
          ))}
        </ul>
      </DetailSection>

      {isOwner && !readOnlyDemo ? (
        <DetailSection title="Einladungen">
          <HouseholdInvitationsPanel
            appOrigin={appOrigin}
            invitations={invitations}
            invitationEmailEnabled={invitationEmailEnabled}
          />
        </DetailSection>
      ) : null}

      <DetailSection title="Kalender & Integrationen">
        <DetailFieldList>
          <DetailField
            label="Kalender-Export"
            value={
              <HouseholdCalendarExport
                householdName={householdName}
                events={calendarEvents}
                feedHttpsUrl={feedHttpsUrl}
                feedWebcalUrl={feedWebcalUrl}
              />
            }
          />
          <DetailField
            label="Google Kalender"
            value={
              <GoogleCalendarPanel
                configured={googleCalendarOAuthConfigured}
                stateSigningConfigured={googleOAuthStateConfigured}
                connection={googleCalendarConnection}
                readOnly={readOnlyDemo}
              />
            }
          />
          <DetailField label="Microsoft Kalender" value="Geplant — Backlog" />
          <DetailField
            label="E-Mail-Inbox"
            value={
              <span className="text-sm text-muted-foreground">
                UI:{" "}
                <Link href="/capture" className="underline underline-offset-2">
                  Smart Capture
                </Link>
                . Automation:{" "}
                <code className="rounded bg-muted px-1 text-xs">
                  POST /api/inbox/capture
                </code>{" "}
                (<code className="rounded bg-muted px-1 text-xs">INBOX_WEBHOOK_SECRET</code>
                ) — <code className="text-xs">docs/INBOX_WEBHOOK.md</code>
              </span>
            }
          />
        </DetailFieldList>
        {!readOnlyDemo && !calendarFeedSubscribeConfigured ? (
          <p className="mt-4 text-xs text-muted-foreground">
            Abo-Link: setze{" "}
            <code className="rounded bg-muted px-1">
              CALENDAR_FEED_SIGNING_SECRET
            </code>
            {` (und bei Supabase zusätzlich `}
            <code className="rounded bg-muted px-1">SUPABASE_SERVICE_ROLE_KEY</code>
            {` nur serverseitig).`}
          </p>
        ) : null}
      </DetailSection>

      <DetailSection title="Daten & Backend">
        <DetailFieldList>
          <DetailField
            label="Konfiguriert"
            value={
              <Badge variant="outline" className="font-normal">
                {diagnostics.configuredSource}
              </Badge>
            }
          />
          <DetailField label="Laufzeit" value={getRuntimeDataBackendLabel()} />
          <DetailField
            label="Supabase Env"
            value={diagnostics.supabaseEnvPresent ? "Vorhanden" : "Nicht gesetzt"}
          />
          <DetailField label="Home" value={diagnostics.homeItemsBackend} />
          <DetailField label="Verträge" value={diagnostics.contractsBackend} />
          <DetailField label="Dokumente" value={diagnostics.documentsBackend} />
          <DetailField
            label="Erinnerungen"
            value={diagnostics.remindersBackend}
          />
          <DetailField
            label="Einladungs-E-Mail"
            value={invitationEmailEnabled ? "Resend aktiv" : "Nicht konfiguriert"}
          />
          <DetailField
            label="Smart Capture"
            value={smartCaptureLlmEnabled ? "KI (LLM)" : "Heuristik"}
          />
        </DetailFieldList>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Migrationen & RLS:{" "}
          <code className="rounded bg-muted px-1 py-0.5">docs/SUPABASE.md</code>
          . Mock-Daten gehen bei Server-Neustart verloren.
        </p>
      </DetailSection>

      <DetailSection title="Produkt">
        <DetailFieldList>
          <DetailField label="Version" value="V0.3" />
          <DetailField
            label="Als Nächstes"
            value="Microsoft OAuth, echte Inbox-Anbindung"
          />
        </DetailFieldList>
      </DetailSection>
    </div>
  );
}
