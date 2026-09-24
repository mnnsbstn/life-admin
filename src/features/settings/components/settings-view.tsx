import { Badge } from "@/components/ui/badge";
import {
  DetailField,
  DetailFieldList,
  DetailSection,
} from "@/components/domain/detail-section";
import { getRepositoryDiagnostics } from "@/lib/repositories";
import type { RuntimeDataBackend } from "@/lib/supabase/env";

interface SettingsViewProps {
  householdName: string;
}

const backendLabels: Record<RuntimeDataBackend, string> = {
  mock: "Mock (In-Memory)",
  "supabase-configured": "Supabase (Env OK — Repos folgen)",
  "supabase-missing-env": "Supabase (Env unvollständig)",
};

export function SettingsView({ householdName }: SettingsViewProps) {
  const diagnostics = getRepositoryDiagnostics();

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Einstellungen</h1>
        <p className="text-sm text-muted-foreground">
          Haushalt und technischer Status von Life Admin V0.1.
        </p>
      </div>

      <DetailSection title="Haushalt">
        <DetailFieldList>
          <DetailField label="Name" value={householdName} />
          <DetailField
            label="Mitglieder"
            value="Demo: ein Owner (Einladungen folgen in V0.2)"
          />
        </DetailFieldList>
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
          <DetailField
            label="Laufzeit"
            value={backendLabels[diagnostics.runtimeBackend]}
          />
          <DetailField
            label="Supabase Env"
            value={diagnostics.supabaseEnvPresent ? "Vorhanden" : "Nicht gesetzt"}
          />
        </DetailFieldList>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Migration & RLS: siehe{" "}
          <code className="rounded bg-muted px-1 py-0.5">docs/SUPABASE.md</code>{" "}
          im Repository. Mock-Daten gehen bei Server-Neustart verloren.
        </p>
      </DetailSection>

      <DetailSection title="Produkt">
        <DetailFieldList>
          <DetailField label="Version" value="V0.1" />
          <DetailField
            label="Geplant"
            value="Auth, Supabase-Repositories, File Storage, weitere Module"
          />
        </DetailFieldList>
      </DetailSection>
    </div>
  );
}
