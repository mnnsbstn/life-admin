import type { Metadata } from "next";

import { ContractListView } from "@/features/contracts/components/contract-list-view";
import type { ContractCategory } from "@/lib/domain/types";
import { getHouseholdContextData } from "@/lib/data/household-data";
import { sortContracts } from "@/lib/domain/list-sort";

export const metadata: Metadata = {
  title: "Verträge",
};

interface ContractsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ContractsPage({ searchParams }: ContractsPageProps) {
  const { category } = await searchParams;
  const { contracts } = await getHouseholdContextData();
  const activeCategory =
    category && category !== "all" ? (category as ContractCategory) : "all";

  return (
    <ContractListView
      items={sortContracts(contracts)}
      activeCategory={activeCategory}
    />
  );
}
