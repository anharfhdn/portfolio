import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  // Standalone breaks Vercel builds on Next 16.3 (ENOENT nft.json); keep it for local/Docker only.
  output: process.env.VERCEL ? undefined : "standalone",
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
