import type { PaymentInterval } from "@/lib/domain/types";

export function formatCurrencyFromCents(
  cents: number,
  currency = "EUR",
): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function formatPaymentInterval(interval: PaymentInterval): string {
  const labels: Record<PaymentInterval, string> = {
    monthly: "Monthly",
    quarterly: "Quarterly",
    yearly: "Yearly",
    once: "One-time",
  };
  return labels[interval];
}
