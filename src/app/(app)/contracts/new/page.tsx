import type { Metadata } from "next";

import { ContractFormNewClient } from "@/features/contracts/components/contract-form-new-client";
import { emptyContractFormValues } from "@/features/contracts/lib/map-form";
import { ReadOnlyDemoNotice } from "@/components/domain/read-only-demo-notice";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";

export const metadata: Metadata = {
  title: "Vertrag anlegen",
};

export default function NewContractPage() {
  if (isGitHubPagesPreview()) {
    return <ReadOnlyDemoNotice backHref="/contracts" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Vertrag anlegen</h1>
      <ContractFormNewClient defaultValues={emptyContractFormValues} />
    </div>
  );
}
