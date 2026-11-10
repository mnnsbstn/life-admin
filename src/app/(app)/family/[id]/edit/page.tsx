import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FamilyMemberForm } from "@/features/family/components/family-member-form";
import { familyMemberToFormValues } from "@/features/family/lib/map-form";
import { ReadOnlyDemoNotice } from "@/components/domain/read-only-demo-notice";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";
import { getRepositories } from "@/lib/repositories";
import { staticFamilyMemberParams } from "@/lib/static-export-params";
import { staticIdParams } from "@/lib/static-generate-params";

export function generateStaticParams() {
  return staticIdParams(staticFamilyMemberParams());
}

interface EditFamilyMemberPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditFamilyMemberPageProps): Promise<Metadata> {
  const { id } = await params;
  const member = await getRepositories().familyMembers.getById(id);
  return { title: member ? `${member.name} bearbeiten` : "Bearbeiten" };
}

export default async function EditFamilyMemberPage({
  params,
}: EditFamilyMemberPageProps) {
  if (isGitHubPagesPreview()) {
    return <ReadOnlyDemoNotice backHref="/family" />;
  }

  const { id } = await params;
  const member = await getRepositories().familyMembers.getById(id);
  if (!member) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Kontakt bearbeiten</h1>
      <FamilyMemberForm
        defaultValues={familyMemberToFormValues(member)}
        memberId={id}
      />
    </div>
  );
}
