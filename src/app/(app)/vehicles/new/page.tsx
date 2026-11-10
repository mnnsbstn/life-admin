import type { Metadata } from "next";

import { VehicleForm } from "@/features/vehicles/components/vehicle-form";
import { emptyVehicleFormValues } from "@/features/vehicles/lib/map-form";
import { ReadOnlyDemoNotice } from "@/components/domain/read-only-demo-notice";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";

export const metadata: Metadata = {
  title: "Fahrzeug anlegen",
};

export default function NewVehiclePage() {
  if (isGitHubPagesPreview()) {
    return <ReadOnlyDemoNotice backHref="/vehicles" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Fahrzeug anlegen</h1>
      <VehicleForm defaultValues={emptyVehicleFormValues} />
    </div>
  );
}
