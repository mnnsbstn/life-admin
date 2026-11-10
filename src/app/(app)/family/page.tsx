import type { Metadata } from "next";

import { FamilyMemberListView } from "@/features/family/components/family-member-list-view";
import { getAppSession } from "@/lib/auth/session";
import { sortFamilyMembers } from "@/lib/domain/list-sort";
import { getRepositories } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "Familie",
};

export default async function FamilyPage() {
  const { householdId } = await getAppSession();
  const items = await getRepositories().familyMembers.list({ householdId });

  return <FamilyMemberListView items={sortFamilyMembers(items)} />;
}
