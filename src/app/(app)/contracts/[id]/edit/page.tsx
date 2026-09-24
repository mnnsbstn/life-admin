import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContractForm } from "@/features/contracts/components/contract-form";
import { contractToFormValues } from "@/features/contracts/lib/map-form";
import { getRepositories } from "@/lib/repositories";

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
