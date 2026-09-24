import Link from "next/link";
import { getDemoContext } from "@/lib/data/demo-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/shared/link-button";
import { EmptyState } from "@/components/shared/empty-state";
import { formatCurrency, labelFromEnum } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default function ContractsListPage() {
  const { repos, householdId } = getDemoContext();
  const contracts = repos.contracts.list(householdId);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{contracts.length} active contracts</p>
        <LinkButton href="/contracts/new" size="sm">
          <Plus className="mr-2 size-4" aria-hidden />
          Add contract
        </LinkButton>
      </div>
      {contracts.length === 0 ? (
        <EmptyState
          title="No contracts"
          description="Track utilities, insurance, and subscriptions."
          action={
            <LinkButton href="/contracts/new">Add contract</LinkButton>
          }
        />
      ) : (
        <ul className="grid gap-3">
          {contracts.map((c) => (
            <li key={c.id}>
              <Link href={`/contracts/${c.id}`}>
                <Card className="border-border/60 shadow-sm transition-colors hover:bg-muted/20">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div>
                      <CardTitle className="text-base font-medium">{c.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{c.provider}</p>
                    </div>
                    <Badge variant="outline" className="font-normal capitalize">
                      {labelFromEnum(c.category)}
                    </Badge>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {c.cost != null
                      ? `${formatCurrency(c.cost, "EUR")}${c.costInterval ? ` / ${labelFromEnum(c.costInterval).toLowerCase()}` : ""}`
                      : "No cost recorded"}
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
