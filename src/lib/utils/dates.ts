import { format, parseISO } from "date-fns";

export function formatDateShort(isoDate: string): string {
  return format(parseISO(isoDate), "dd.MM.yyyy");
}

export function formatDateMedium(isoDate: string): string {
  return format(parseISO(isoDate), "d MMM yyyy");
}

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}
