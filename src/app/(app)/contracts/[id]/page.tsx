import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContractDetailView } from "@/features/contracts/components/contract-detail-view";
import {
  documentsForContract,
  remindersForContract,
} from "@/lib/data/resolve-links";
import { getHouseholdContextData } from "@/lib/data/household-data";
import { getRepositories } from "@/lib/repositories";

interface ContractDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ContractDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const contract = await getRepositories().contracts.getById(id);
  return { title: contract?.name ?? "Vertrag" };
}

export default async function ContractDetailPage({
  params,
}: ContractDetailPageProps) {
  const { id } = await params;
  const contract = await getRepositories().contracts.getById(id);
  if (!contract) notFound();

  const { documents, reminders } = await getHouseholdContextData();

  return (
    <ContractDetailView
      contract={contract}
      documents={documentsForContract(documents, id)}
      reminders={remindersForContract(reminders, id)}
    />
  );
}
