"use client";

import Link from "next/link";

import { isGitHubPagesPreview } from "@/lib/deployment-mode";

export function GitHubPagesBanner() {
  if (!isGitHubPagesPreview()) {
    return null;
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-950 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-100">
      <strong>GitHub Pages Demo</strong> — read-only Mock-Daten. Bearbeiten, Login und
      Supabase funktionieren hier nicht.{" "}
      <Link
        href="https://github.com/mnnsbstn/life-admin/blob/main/docs/DEPLOYMENT.md"
        className="underline underline-offset-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        Vollversion deployen
      </Link>
    </div>
  );
}
