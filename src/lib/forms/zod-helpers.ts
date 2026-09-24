import { z } from "zod";

export const requiredText = z.string().trim().min(1, "Pflichtfeld");

export const optionalText = z
  .string()
  .trim()
  .transform((value) => value || undefined);

export const optionalDate = z
  .string()
  .transform((value) => value || undefined);

export const optionalCentsFromEuro = z
  .string()
  .transform((value) => {
    if (!value.trim()) return undefined;
    const n = Number(value.replace(",", "."));
    if (Number.isNaN(n)) return undefined;
    return Math.round(n * 100);
  });

export const optionalInt = z
  .string()
  .transform((value) => {
    if (!value.trim()) return undefined;
    const n = Number(value);
    if (Number.isNaN(n)) return undefined;
    return n;
  });
