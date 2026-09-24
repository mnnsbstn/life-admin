import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/shell/module-placeholder";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <ModulePlaceholder
      title="Settings"
      description="Einstellungen und Haushalt-Verwaltung folgen nach V0.1 Core."
    />
  );
}
