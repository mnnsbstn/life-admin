import type { Metadata } from "next";

import { TodayView } from "@/features/today/components/today-view";
import { getHouseholdContextData } from "@/lib/data/household-data";
import {
  buildAttentionItems,
  buildUpcomingItems,
} from "@/lib/services/dashboard.service";

export const metadata: Metadata = {
  title: "Heute",
};

export default async function TodayPage() {
  const { session, homeItems, contracts, reminders } =
    await getHouseholdContextData();

  const attention = buildAttentionItems({ homeItems, contracts, reminders });
  const upcoming = buildUpcomingItems({ homeItems, contracts, reminders });

  return (
    <TodayView
      displayName={session.user.displayName}
      attention={attention}
      upcoming={upcoming}
    />
  );
}
