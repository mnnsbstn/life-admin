import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FinancialAccountDetailView } from "@/features/money/components/financial-account-detail-view";
import { getRepositories } from "@/lib/repositories";
import { staticFinancialAccountParams } from "@/lib/static-export-params";
import { staticIdParams } from "@/lib/static-generate-params";

export function generateStaticParams() {
  return staticIdParams(staticFinancialAccountParams());
}

interface FinancialAccountDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: FinancialAccountDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const account = await getRepositories().financialAccounts.getById(id);
  return { title: account?.name ?? "Konto" };
}

export default async function FinancialAccountDetailPage({
  params,
}: FinancialAccountDetailPageProps) {
  const { id } = await params;
  const account = await getRepositories().financialAccounts.getById(id);
  if (!account) notFound();

  return <FinancialAccountDetailView account={account} />;
}
