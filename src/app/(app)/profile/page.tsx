import type { Metadata } from "next";

import { ProfileView } from "@/features/profile/components/profile-view";
import { getAppSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Profil",
};

export default async function ProfilePage() {
  const session = await getAppSession();

  return <ProfileView user={session.user} authMode={session.mode} />;
}
