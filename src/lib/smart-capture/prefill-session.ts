export function writeSmartCapturePrefill(
  key: string,
  data: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(key, JSON.stringify(data));
}

export function readSmartCapturePrefill<T extends Record<string, unknown>>(
  key: string,
): Partial<T> | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  sessionStorage.removeItem(key);
  try {
    return JSON.parse(raw) as Partial<T>;
  } catch {
    return null;
  }
}
