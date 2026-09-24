import Link from "next/link";
import { getDemoContext } from "@/lib/data/demo-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/shared/link-button";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDateDE, labelFromEnum } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default function HomeListPage() {
  const { repos, householdId } = getDemoContext();
  const items = repos.homeItems.list(householdId);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} items in your home</p>
        <LinkButton href="/home/new" size="sm">
          <Plus className="mr-2 size-4" aria-hidden />
          Add item
        </LinkButton>
      </div>
      {items.length === 0 ? (
        <EmptyState
          title="No home items yet"
          description="Track appliances, systems, and devices in one place."
          action={
            <LinkButton href="/home/new">Add home item</LinkButton>
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link href={`/home/${item.id}`} className="block h-full">
                <Card className="h-full border-border/60 shadow-sm transition-colors hover:bg-muted/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-medium">{item.name}</CardTitle>
                      <Badge variant="secondary" className="font-normal capitalize">
                        {labelFromEnum(item.category)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {[item.manufacturer, item.model].filter(Boolean).join(" · ") || item.location}
                    {item.nextMaintenanceAt ? (
                      <p className="mt-2 text-xs">Next maintenance {formatDateDE(item.nextMaintenanceAt)}</p>
                    ) : null}
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
