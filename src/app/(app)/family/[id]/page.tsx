import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FamilyMemberDetailView } from "@/features/family/components/family-member-detail-view";
import { getRepositories } from "@/lib/repositories";
import { staticFamilyMemberParams } from "@/lib/static-export-params";
import { staticIdParams } from "@/lib/static-generate-params";

export function generateStaticParams() {
  return staticIdParams(staticFamilyMemberParams());
}

interface FamilyMemberDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: FamilyMemberDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const member = await getRepositories().familyMembers.getById(id);
  return { title: member?.name ?? "Kontakt" };
}

export default async function FamilyMemberDetailPage({
  params,
}: FamilyMemberDetailPageProps) {
  const { id } = await params;
  const member = await getRepositories().familyMembers.getById(id);
  if (!member) notFound();

  return <FamilyMemberDetailView member={member} />;
}
