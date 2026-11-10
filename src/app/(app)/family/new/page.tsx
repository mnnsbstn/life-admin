import type { Metadata } from "next";

import { FamilyMemberForm } from "@/features/family/components/family-member-form";
import { emptyFamilyMemberFormValues } from "@/features/family/lib/map-form";
import { ReadOnlyDemoNotice } from "@/components/domain/read-only-demo-notice";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";

export const metadata: Metadata = {
  title: "Kontakt anlegen",
};

export default function NewFamilyMemberPage() {
  if (isGitHubPagesPreview()) {
    return <ReadOnlyDemoNotice backHref="/family" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Kontakt anlegen</h1>
      <FamilyMemberForm defaultValues={emptyFamilyMemberFormValues} />
    </div>
  );
}
