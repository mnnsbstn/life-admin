export function formatUrgencyLabel(urgencyDays: number): string {
  if (urgencyDays < -1) {
    return `${Math.abs(urgencyDays)} Tage überfällig`;
  }
  if (urgencyDays === -1) {
    return "1 Tag überfällig";
  }
  if (urgencyDays === 0) {
    return "Heute";
  }
  if (urgencyDays === 1) {
    return "Morgen";
  }
  return `In ${urgencyDays} Tagen`;
}

export function formatAttentionSummary(count: number): string {
  if (count === 0) {
    return "Alles im Blick — nichts Dringendes.";
  }
  if (count === 1) {
    return "1 Ding braucht deine Aufmerksamkeit.";
  }
  return `${count} Dinge brauchen deine Aufmerksamkeit.`;
}

export type UrgencyTone = "overdue" | "today" | "soon";

export function getUrgencyTone(urgencyDays: number): UrgencyTone {
  if (urgencyDays < 0) return "overdue";
  if (urgencyDays <= 1) return "today";
  return "soon";
}
