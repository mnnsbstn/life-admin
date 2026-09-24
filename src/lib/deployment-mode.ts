/** Set at build time for GitHub Pages static export (see npm run build:gh-pages). */
export function isGitHubPagesPreview(): boolean {
  return process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";
}

export function isStaticExportBuild(): boolean {
  return process.env.GITHUB_PAGES === "1";
}

/** Public site origin for invite links in the GitHub Pages static export. */
export function githubPagesAppOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_GITHUB_PAGES_ORIGIN ??
    "https://mnnsbstn.github.io/life-admin"
  );
}
