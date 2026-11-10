import type { Metadata } from "next";

import { VehicleListView } from "@/features/vehicles/components/vehicle-list-view";
import { getAppSession } from "@/lib/auth/session";
import { sortVehicles } from "@/lib/domain/list-sort";
import { getRepositories } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "Fahrzeuge",
};

export default async function VehiclesPage() {
  const { householdId } = await getAppSession();
  const items = await getRepositories().vehicles.list({ householdId });

  return <VehicleListView items={sortVehicles(items)} />;
}
