import { Greeting } from "@/components/dashboard/greeting";
import { AttentionList } from "@/components/dashboard/attention-list";
import { UpcomingTimeline } from "@/components/dashboard/upcoming-timeline";
import { getDemoContext, getEntitySnapshot } from "@/lib/data/demo-context";
import { generateAttentionItems, getAttentionCount } from "@/lib/services/attention";
import { generateUpcomingEvents } from "@/lib/services/upcoming";

export default function TodayPage() {
  const { user } = getDemoContext();
  const snapshot = getEntitySnapshot();
  const attention = generateAttentionItems(snapshot);
  const attentionCount = getAttentionCount(snapshot);
  const upcoming = generateUpcomingEvents(snapshot);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Greeting displayName={user.displayName} attentionCount={attentionCount} />
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <AttentionList items={attention} totalCount={attentionCount} />
        </div>
        <div className="lg:col-span-2">
          <UpcomingTimeline events={upcoming} />
        </div>
      </div>
    </div>
  );
}
