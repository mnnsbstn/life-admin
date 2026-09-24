import type { Metadata } from "next";

import { ProfileView } from "@/features/profile/components/profile-view";
import { getDemoSession } from "@/lib/auth/demo-session";

export const metadata: Metadata = {
  title: "Profil",
};

export default async function ProfilePage() {
  const { user } = await getDemoSession();

  return <ProfileView user={user} />;
}
