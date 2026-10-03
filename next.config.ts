import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allows the Arena/e2b sandbox preview host to load dev resources
  // (HMR websocket) without affecting production builds.
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
