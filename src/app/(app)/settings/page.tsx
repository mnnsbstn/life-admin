import type { Metadata } from "next";

import { SettingsView } from "@/features/settings/components/settings-view";
import { getDemoSession } from "@/lib/auth/demo-session";

export const metadata: Metadata = {
  title: "Einstellungen",
};

export default async function SettingsPage() {
  const { household } = await getDemoSession();

  return <SettingsView householdName={household.name} />;
}
