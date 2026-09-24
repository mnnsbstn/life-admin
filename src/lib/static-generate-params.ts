import { isStaticExportBuild } from "@/lib/deployment-mode";

/** Pre-render seed `[id]` routes only when building GitHub Pages static export. */
export function staticIdParams(
  ids: Array<{ id: string }>,
): Array<{ id: string }> {
  if (!isStaticExportBuild()) {
    return [];
  }
  return ids;
}

/** Pre-render dynamic `[param]` routes only when building GitHub Pages static export. */
export function staticExportParams<T extends Record<string, string>>(
  params: T[],
): T[] {
  if (!isStaticExportBuild()) {
    return [];
  }
  return params;
}
