import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "1";
const repoBasePath = "/life-admin";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export" as const,
        basePath: repoBasePath,
        assetPrefix: repoBasePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
