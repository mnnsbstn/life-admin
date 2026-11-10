import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { VehicleDetailView } from "@/features/vehicles/components/vehicle-detail-view";
import { getRepositories } from "@/lib/repositories";
import { staticVehicleParams } from "@/lib/static-export-params";
import { staticIdParams } from "@/lib/static-generate-params";

export function generateStaticParams() {
  return staticIdParams(staticVehicleParams());
}

interface VehicleDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: VehicleDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await getRepositories().vehicles.getById(id);
  return { title: vehicle?.name ?? "Fahrzeug" };
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { id } = await params;
  const vehicle = await getRepositories().vehicles.getById(id);
  if (!vehicle) notFound();

  return <VehicleDetailView vehicle={vehicle} />;
}
