import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FinancialAccountForm } from "@/features/money/components/financial-account-form";
import { financialAccountToFormValues } from "@/features/money/lib/map-form";
import { ReadOnlyDemoNotice } from "@/components/domain/read-only-demo-notice";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";
import { getRepositories } from "@/lib/repositories";
import { staticFinancialAccountParams } from "@/lib/static-export-params";
import { staticIdParams } from "@/lib/static-generate-params";

export function generateStaticParams() {
  return staticIdParams(staticFinancialAccountParams());
}

interface EditFinancialAccountPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditFinancialAccountPageProps): Promise<Metadata> {
  const { id } = await params;
  const account = await getRepositories().financialAccounts.getById(id);
  return { title: account ? `${account.name} bearbeiten` : "Bearbeiten" };
}

export default async function EditFinancialAccountPage({
  params,
}: EditFinancialAccountPageProps) {
  if (isGitHubPagesPreview()) {
    return <ReadOnlyDemoNotice backHref="/money" />;
  }

  const { id } = await params;
  const account = await getRepositories().financialAccounts.getById(id);
  if (!account) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Konto bearbeiten</h1>
      <FinancialAccountForm
        defaultValues={financialAccountToFormValues(account)}
        accountId={id}
      />
    </div>
  );
}
