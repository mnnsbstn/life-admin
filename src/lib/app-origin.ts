/** Public app URL for invite links and outbound mail. */
export function resolveAppOriginFromEnv(): string | undefined {
  if (process.env.LIFE_ADMIN_APP_ORIGIN?.trim()) {
    return process.env.LIFE_ADMIN_APP_ORIGIN.trim().replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL?.trim()) {
    return `https://${process.env.VERCEL_URL.trim()}`;
  }

  return undefined;
}

export function resolveAppOrigin(headerStore: Headers): string {
  return (
    resolveAppOriginFromEnv() ??
    (() => {
      const host =
        headerStore.get("x-forwarded-host") ??
        headerStore.get("host") ??
        "localhost:3000";
      const proto = headerStore.get("x-forwarded-proto") ?? "http";
      return `${proto}://${host}`;
    })()
  );
}

export function buildInviteUrl(appOrigin: string, token: string): string {
  return `${appOrigin.replace(/\/$/, "")}/invite/${token}`;
}
