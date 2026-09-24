export function parseEuroToCents(value?: string): number | undefined {
  if (!value?.trim()) return undefined;
  const n = Number(value.replace(",", "."));
  if (Number.isNaN(n)) return undefined;
  return Math.round(n * 100);
}

export function parseOptionalInt(value?: string): number | undefined {
  if (!value?.trim()) return undefined;
  const n = Number(value);
  if (Number.isNaN(n)) return undefined;
  return n;
}

export function emptyToUndefined(value?: string): string | undefined {
  if (!value?.trim()) return undefined;
  return value.trim();
}
