import {
  DetailField,
  DetailFieldList,
  DetailSection,
} from "@/components/domain/detail-section";
import type { User } from "@/lib/domain/types";

interface ProfileViewProps {
  user: User;
}

export function ProfileView({ user }: ProfileViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Profil</h1>
        <p className="text-sm text-muted-foreground">
          Demo-Benutzer ohne Anmeldung — Supabase Auth folgt in V0.2.
        </p>
      </div>

      <DetailSection title="Konto">
        <DetailFieldList>
          <DetailField label="Name" value={user.displayName} />
          <DetailField label="E-Mail" value={user.email} />
          <DetailField
            label="Mitglied seit"
            value={new Date(user.createdAt).toLocaleDateString("de-DE")}
          />
        </DetailFieldList>
      </DetailSection>
    </div>
  );
}
