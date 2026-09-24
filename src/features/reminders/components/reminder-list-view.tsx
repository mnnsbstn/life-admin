import { EmptyState } from "@/components/domain/empty-state";
import { EntityListCard } from "@/components/domain/entity-list-card";
import { PriorityBadge } from "@/components/domain/priority-badge";
import { ReminderStatusBadge } from "@/components/domain/reminder-status-badge";
import { ListPageHeader } from "@/components/shell/list-page-header";
import { resolveReminderLink } from "@/lib/data/resolve-links";
import { withDerivedReminderStatus } from "@/lib/domain/reminder-status";
import type {
  Contract,
  HomeItem,
  Reminder,
  ReminderStatus,
} from "@/lib/domain/types";
import { formatDisplayDate } from "@/lib/format/date";
import { Bell } from "lucide-react";

interface ReminderListViewProps {
  items: Reminder[];
  homeItems: HomeItem[];
  contracts: Contract[];
  statusFilter: ReminderStatus | "all";
}

const filterOptions: { value: ReminderStatus | "all"; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "due", label: "Fällig" },
  { value: "upcoming", label: "Geplant" },
  { value: "completed", label: "Erledigt" },
];

export function ReminderListView({
  items,
  homeItems,
  contracts,
  statusFilter,
}: ReminderListViewProps) {
  const enriched = items.map((r) => withDerivedReminderStatus(r));
  const filtered =
    statusFilter === "all"
      ? enriched
      : enriched.filter((r) => r.status === statusFilter);

  return (
    <div className="flex flex-col gap-8">
      <ListPageHeader
        title="Erinnerungen"
        description="Manuelle Reminder und später automatisch abgeleitete Fristen."
        addHref="/reminders/new"
        addLabel="Erinnerung"
      />

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <a
            key={opt.value}
            href={
              opt.value === "all"
                ? "/reminders"
                : `/reminders?status=${opt.value}`
            }
            className={
              statusFilter === opt.value
                ? "rounded-full border border-foreground/15 bg-foreground px-3 py-1 text-xs font-medium text-background"
                : "rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
            }
          >
            {opt.label}
          </a>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Keine Erinnerungen"
          description="Erstelle eine Erinnerung für Wartung, Kündigung oder Garantie."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((reminder) => {
            const link = resolveReminderLink(
              reminder.link,
              homeItems,
              contracts,
            );
            return (
              <li key={reminder.id}>
                <EntityListCard
                  href={`/reminders/${reminder.id}`}
                  title={reminder.title}
                  subtitle={link.label}
                  meta={`Fällig: ${formatDisplayDate(reminder.dueDate)}`}
                  badges={
                    <>
                      <ReminderStatusBadge status={reminder.status} />
                      <PriorityBadge priority={reminder.priority} />
                    </>
                  }
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
