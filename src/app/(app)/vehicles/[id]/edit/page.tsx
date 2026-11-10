import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { VehicleForm } from "@/features/vehicles/components/vehicle-form";
import { vehicleToFormValues } from "@/features/vehicles/lib/map-form";
import { ReadOnlyDemoNotice } from "@/components/domain/read-only-demo-notice";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";
import { getRepositories } from "@/lib/repositories";
import { staticVehicleParams } from "@/lib/static-export-params";
import { staticIdParams } from "@/lib/static-generate-params";

export function generateStaticParams() {
  return staticIdParams(staticVehicleParams());
}

interface EditVehiclePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditVehiclePageProps): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await getRepositories().vehicles.getById(id);
  return { title: vehicle ? `${vehicle.name} bearbeiten` : "Bearbeiten" };
}

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  if (isGitHubPagesPreview()) {
    return <ReadOnlyDemoNotice backHref="/vehicles" />;
  }

  const { id } = await params;
  const vehicle = await getRepositories().vehicles.getById(id);
  if (!vehicle) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Fahrzeug bearbeiten</h1>
      <VehicleForm defaultValues={vehicleToFormValues(vehicle)} vehicleId={id} />
    </div>
  );
}
