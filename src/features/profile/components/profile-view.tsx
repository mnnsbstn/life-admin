import {
  DetailField,
  DetailFieldList,
  DetailSection,
} from "@/components/domain/detail-section";
import { SignOutButton } from "@/features/profile/components/sign-out-button";
import type { User } from "@/lib/domain/types";

interface ProfileViewProps {
  user: User;
  authMode: "mock" | "supabase";
}

export function ProfileView({ user, authMode }: ProfileViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Profil</h1>
          <p className="text-sm text-muted-foreground">
            {authMode === "supabase"
              ? "Angemeldet über Supabase Auth."
              : "Demo-Benutzer ohne Anmeldung (Mock-Modus)."}
          </p>
        </div>
        {authMode === "supabase" ? <SignOutButton /> : null}
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
