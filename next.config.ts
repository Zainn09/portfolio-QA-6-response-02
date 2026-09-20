import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sandbox/preview hosts must be allowed or Next blocks HMR and the browser
  // keeps running a stale client bundle against freshly-updated CSS.
  allowedDevOrigins: ["*.e2b.app"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
