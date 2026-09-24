import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/shell/module-placeholder";
import { getHouseholdContextData } from "@/lib/data/household-data";
import {
  buildAttentionItems,
  buildUpcomingItems,
} from "@/lib/services/dashboard.service";

export const metadata: Metadata = {
  title: "Today",
};

export default async function TodayPage() {
  const { session, homeItems, contracts, reminders } =
    await getHouseholdContextData();

  const attention = buildAttentionItems({ homeItems, contracts, reminders });
  const upcoming = buildUpcomingItems({ homeItems, contracts, reminders });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 md:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Today · Setup OK
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Hallo {session.user.displayName} — Mock-Daten geladen für{" "}
          {session.household.name}.
        </p>
      </div>

      <div className="rounded-xl border border-border/80 bg-card p-4 text-sm shadow-sm">
        <p className="font-medium">{attention.length} Attention Items (Preview)</p>
        <ul className="mt-2 space-y-1 text-muted-foreground">
          {attention.slice(0, 5).map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-border/80 bg-card p-4 text-sm shadow-sm">
        <p className="font-medium">{upcoming.length} Upcoming Items (Preview)</p>
        <ul className="mt-2 space-y-1 text-muted-foreground">
          {upcoming.slice(0, 5).map((item) => (
            <li key={item.id}>
              {item.date} — {item.title}
            </li>
          ))}
        </ul>
      </div>

      <ModulePlaceholder
        title="Nächster Schritt"
        description="Step 3–5 bauen Design System, Application Shell und das vollständige Today-Dashboard. Die Daten- und Repository-Schicht steht bereits."
      />
    </div>
  );
}
