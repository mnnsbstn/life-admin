import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContractForm } from "@/features/contracts/components/contract-form";
import { contractToFormValues } from "@/features/contracts/lib/map-form";
import { getRepositories } from "@/lib/repositories";
import { staticContractParams } from "@/lib/static-export-params";
import { staticIdParams } from "@/lib/static-generate-params";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";
import { ReadOnlyDemoNotice } from "@/components/domain/read-only-demo-notice";

export function generateStaticParams() {
  return staticIdParams(staticContractParams());
}

interface EditContractPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditContractPageProps): Promise<Metadata> {
  const { id } = await params;
  const contract = await getRepositories().contracts.getById(id);
  return { title: contract ? `${contract.name} bearbeiten` : "Bearbeiten" };
}

export default async function EditContractPage({ params }: EditContractPageProps) {
  if (isGitHubPagesPreview()) {
    return <ReadOnlyDemoNotice backHref="/contracts" />;
  }

  const { id } = await params;
  const contract = await getRepositories().contracts.getById(id);
  if (!contract) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Vertrag bearbeiten</h1>
      <ContractForm
        defaultValues={contractToFormValues(contract)}
        contractId={id}
      />
    </div>
  );
}
