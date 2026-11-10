import { CategoryBadge } from "@/components/domain/category-badge";
import {
  DetailField,
  DetailFieldList,
  DetailSection,
} from "@/components/domain/detail-section";
import { DeleteEntityButton } from "@/components/domain/delete-entity-button";
import { EntityHeader } from "@/components/domain/entity-header";
import { deleteVehicleAction } from "@/lib/actions/vehicles";
import { isGitHubPagesPreview } from "@/lib/deployment-mode";
import { vehicleKindLabels } from "@/config/vehicle-kinds";
import { getVehicleSubtitle } from "@/lib/domain/vehicle-meta";
import type { Vehicle } from "@/lib/domain/types";
import { formatDisplayDate } from "@/lib/format/date";

interface VehicleDetailViewProps {
  vehicle: Vehicle;
}

export function VehicleDetailView({ vehicle }: VehicleDetailViewProps) {
  const readOnly = isGitHubPagesPreview();

  return (
    <div className="flex flex-col gap-8">
      <EntityHeader
        backHref="/vehicles"
        backLabel="Fahrzeuge"
        title={vehicle.name}
        description={getVehicleSubtitle(vehicle)}
        badges={<CategoryBadge label={vehicleKindLabels[vehicle.kind]} />}
        editHref={readOnly ? undefined : `/vehicles/${vehicle.id}/edit`}
        actions={
          readOnly ? undefined : (
            <DeleteEntityButton
              title="Fahrzeug löschen?"
              description="Das Fahrzeug wird dauerhaft entfernt."
              deleteAction={deleteVehicleAction.bind(null, vehicle.id)}
            />
          )
        }
      />

      <DetailSection title="Stammdaten">
        <DetailFieldList>
          <DetailField label="Kennzeichen" value={vehicle.licensePlate} />
          <DetailField
            label="Baujahr"
            value={vehicle.year != null ? String(vehicle.year) : undefined}
          />
          <DetailField
            label="Nächste HU"
            value={
              vehicle.nextInspectionAt
                ? formatDisplayDate(vehicle.nextInspectionAt)
                : undefined
            }
          />
          <DetailField
            label="Versicherung bis"
            value={
              vehicle.insuranceEndsAt
                ? formatDisplayDate(vehicle.insuranceEndsAt)
                : undefined
            }
          />
        </DetailFieldList>
      </DetailSection>

      {vehicle.notes ? (
        <DetailSection title="Notizen">
          <p className="text-sm leading-relaxed text-foreground">{vehicle.notes}</p>
        </DetailSection>
      ) : null}
    </div>
  );
}
