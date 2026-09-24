import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";

export function formatDisplayDate(isoDate: string): string {
  return format(parseISO(isoDate), "dd.MM.yyyy", { locale: de });
}

export function formatShortDate(isoDate: string): string {
  return format(parseISO(isoDate), "dd.MM.", { locale: de });
}
