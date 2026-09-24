import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/shell/module-placeholder";
import { getHouseholdContextData } from "@/lib/data/household-data";

export const metadata: Metadata = {
  title: "Home",
};

export default async function HomePage() {
  const { homeItems } = await getHouseholdContextData();

  return (
    <>
      <ModulePlaceholder
        title="Home"
        description={`${homeItems.length} Home Items in Mock-Daten — Modul-UI folgt in Step 6.`}
      />
    </>
  );
}
