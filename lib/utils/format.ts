import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";

export function formatDateDE(isoDate: string | null | undefined): string {
  if (!isoDate) return "—";
  try {
    const d = isoDate.includes("T") ? parseISO(isoDate) : parseISO(`${isoDate}T12:00:00`);
    return format(d, "dd.MM.yyyy", { locale: de });
  } catch {
    return isoDate;
  }
}

export function formatDateShortDE(isoDate: string): string {
  const d = isoDate.includes("T") ? parseISO(isoDate) : parseISO(`${isoDate}T12:00:00`);
  return format(d, "dd.MM", { locale: de });
}

export function formatDateTimeEN(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy");
}

export function formatCurrency(
  amount: number | null | undefined,
  currency = "EUR",
): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-DE", { style: "currency", currency }).format(amount);
}

export function labelFromEnum(value: string): string {
  return value
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
