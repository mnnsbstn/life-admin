import { CategoryBadge } from "@/components/domain/category-badge";
import { EmptyState } from "@/components/domain/empty-state";
import { EntityListCard } from "@/components/domain/entity-list-card";
import { ListPageHeader } from "@/components/shell/list-page-header";
import { homeItemCategoryLabels } from "@/config/categories";
import {
  getHomeItemListMeta,
  getHomeItemSubtitle,
} from "@/lib/domain/home-item-meta";
import type { HomeItem } from "@/lib/domain/types";
import { Home } from "lucide-react";

interface HomeListViewProps {
  items: HomeItem[];
}

export function HomeListView({ items }: HomeListViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <ListPageHeader
        title="Home"
        description="Geräte, Anlagen und Bereiche in deinem Haushalt."
        addHref="/home/new"
        addLabel="Home Item"
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Home}
          title="Noch keine Home Items"
          description="Lege deine erste Anlage oder dein erstes Gerät an — z. B. Heizung oder Waschmaschine."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id}>
              <EntityListCard
                href={`/home/${item.id}`}
                title={item.name}
                subtitle={getHomeItemSubtitle(item)}
                meta={getHomeItemListMeta(item)}
                badges={
                  <CategoryBadge label={homeItemCategoryLabels[item.category]} />
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
