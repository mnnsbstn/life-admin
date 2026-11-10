import type { Metadata } from "next";

import { FinancialAccountForm } from "@/features/money/components/financial-account-form";
import { emptyFinancialAccountFormValues } from "@/features/money/lib/map-form";
import { ReadOnlyDemoNotice } from "@/components/domain/read-only-demo-notice";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";

export const metadata: Metadata = {
  title: "Konto anlegen",
};

export default function NewFinancialAccountPage() {
  if (isGitHubPagesPreview()) {
    return <ReadOnlyDemoNotice backHref="/money" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Konto anlegen</h1>
      <FinancialAccountForm defaultValues={emptyFinancialAccountFormValues} />
    </div>
  );
}
