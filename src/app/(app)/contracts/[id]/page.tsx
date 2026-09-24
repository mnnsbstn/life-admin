import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ModulePlaceholder } from "@/components/shell/module-placeholder";
import { getRepositories } from "@/lib/repositories";

interface ContractDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ContractDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const contract = await getRepositories().contracts.getById(id);
  return { title: contract?.name ?? "Contract" };
}

export default async function ContractDetailPage({
  params,
}: ContractDetailPageProps) {
  const { id } = await params;
  const contract = await getRepositories().contracts.getById(id);
  if (!contract) notFound();

  return (
    <ModulePlaceholder
      title={contract.name}
      description="Detailansicht wird in Step 7 implementiert."
    />
  );
}
