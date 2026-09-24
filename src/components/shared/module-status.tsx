"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHouseholdData } from "@/hooks/use-household-data";

type ModuleStatusProps = {
  title: string;
  description: string;
  countLabel: string;
  count: number | undefined;
};

export function ModuleStatus({
  title,
  description,
  countLabel,
  count,
}: ModuleStatusProps) {
  const { loading, error, session } = useHouseholdData();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Data layer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {loading && <p>Loading household data…</p>}
          {error && <p className="text-destructive">{error}</p>}
          {!loading && !error && session && (
            <>
              <p>
                Household:{" "}
                <span className="text-foreground">{session.household.name}</span>
              </p>
              <p>
                {countLabel}:{" "}
                <span className="text-foreground">{count ?? 0}</span>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
