import type { Metadata } from "next";

import { HomeListView } from "@/features/home/components/home-list-view";
import { getHouseholdContextData } from "@/lib/data/household-data";
import { sortHomeItems } from "@/lib/domain/list-sort";

export const metadata: Metadata = {
  title: "Home",
};

export default async function HomePage() {
  const { homeItems } = await getHouseholdContextData();

  return <HomeListView items={sortHomeItems(homeItems)} />;
}
