import { AppShell } from "@/components/shell/app-shell";
import { getAppSession } from "@/lib/auth/session";
import { AppProviders } from "@/providers/app-providers";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, household } = await getAppSession();

  return (
    <AppProviders
      householdId={household.id}
      householdName={household.name}
      userDisplayName={user.displayName}
    >
      <AppShell>{children}</AppShell>
    </AppProviders>
  );
}
