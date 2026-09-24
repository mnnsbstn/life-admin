import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/shell/module-placeholder";
import { getDemoSession } from "@/lib/auth/demo-session";

export const metadata: Metadata = {
  title: "Profil",
};

export default async function ProfilePage() {
  const { user } = await getDemoSession();

  return (
    <ModulePlaceholder
      title="Profile"
      description={`Angemeldet als ${user.displayName} (${user.email}) — Demo-Session ohne Auth.`}
    />
  );
}
