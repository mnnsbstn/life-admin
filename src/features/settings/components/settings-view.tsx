import { Badge } from "@/components/ui/badge";
import {
  DetailField,
  DetailFieldList,
  DetailSection,
} from "@/components/domain/detail-section";
import { HouseholdInvitationsPanel } from "@/features/settings/components/household-invitations-panel";
import { HouseholdNameForm } from "@/features/settings/components/household-name-form";
import type {
  HouseholdInvitation,
  HouseholdMemberRole,
  HouseholdMemberView,
} from "@/lib/domain/types";
import { getRepositoryDiagnostics } from "@/lib/repositories";
import { getRuntimeDataBackendLabel } from "@/lib/supabase/env";

interface SettingsViewProps {
  householdName: string;
  members: HouseholdMemberView[];
  invitations: HouseholdInvitation[];
  memberRole: HouseholdMemberRole;
  appOrigin: string;
}

const roleLabels: Record<HouseholdMemberRole, string> = {
  owner: "Owner",
  member: "Mitglied",
  viewer: "Betrachter",
};

export function SettingsView({
  householdName,
  members,
  invitations,
  memberRole,
  appOrigin,
}: SettingsViewProps) {
  const diagnostics = getRepositoryDiagnostics();
  const isOwner = memberRole === "owner";

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Einstellungen</h1>
        <p className="text-sm text-muted-foreground">
          Haushalt, Mitglieder und technischer Status (V0.2).
        </p>
      </div>

      <DetailSection title="Haushalt">
        <HouseholdNameForm defaultName={householdName} disabled={!isOwner} />
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

      {isOwner ? (
        <DetailSection title="Einladungen">
          <HouseholdInvitationsPanel
            appOrigin={appOrigin}
            invitations={invitations}
          />
        </DetailSection>
      ) : null}

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
        </DetailFieldList>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Migrationen & RLS:{" "}
          <code className="rounded bg-muted px-1 py-0.5">docs/SUPABASE.md</code>
          . Mock-Daten gehen bei Server-Neustart verloren.
        </p>
      </DetailSection>

      <DetailSection title="Produkt">
        <DetailFieldList>
          <DetailField label="Version" value="V0.2" />
          <DetailField
            label="Als Nächstes"
            value="Deployment, E2E-Tests, weitere Life-Module"
          />
        </DetailFieldList>
      </DetailSection>
    </div>
  );
}
