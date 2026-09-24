import type { PaymentInterval } from "@/lib/domain/types";

export const paymentIntervalLabels: Record<PaymentInterval, string> = {
  monthly: "Monatlich",
  quarterly: "Vierteljährlich",
  yearly: "Jährlich",
  once: "Einmalig",
};

export const paymentIntervalOptions = Object.entries(paymentIntervalLabels).map(
  ([value, label]) => ({ value: value as PaymentInterval, label }),
);
