import { CategoryBadge } from "@/components/domain/category-badge";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityListCard } from "@/components/domain/entity-list-card";
import { ListPageHeader } from "@/components/shell/list-page-header";
import { vehicleKindLabels } from "@/config/vehicle-kinds";
import {
  getVehicleListMeta,
  getVehicleSubtitle,
} from "@/lib/domain/vehicle-meta";
import type { Vehicle } from "@/lib/domain/types";
import { Car } from "lucide-react";

interface VehicleListViewProps {
  items: Vehicle[];
}

export function VehicleListView({ items }: VehicleListViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <ListPageHeader
        title="Fahrzeuge"
        description="Autos, Zweiräder und HU- oder Versicherungsfristen."
        addHref="/vehicles/new"
        addLabel="Fahrzeug"
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Car}
          title="Noch keine Fahrzeuge"
          description="Lege dein erstes Fahrzeug an, um Termine im Blick zu behalten."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((vehicle) => (
            <li key={vehicle.id}>
              <EntityListCard
                href={`/vehicles/${vehicle.id}`}
                title={vehicle.name}
                subtitle={getVehicleSubtitle(vehicle)}
                meta={getVehicleListMeta(vehicle)}
                badges={
                  <CategoryBadge label={vehicleKindLabels[vehicle.kind]} />
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
