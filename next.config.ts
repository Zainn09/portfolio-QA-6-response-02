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
  async redirects() {
    return [
      // Near-duplicate consolidation: the "-2" variant of the AI shopping
      // assistants post (2025-10) shared its meta title/description and
      // ~70% of its body with the canonical post (2025-05). Its two unique
      // case sections were ported into the canonical post, then the variant
      // was removed from the data set.
      {
        source: "/blogs/how-ai-shopping-assistants-are-rewiring-product-discovery-for-e-commerce-brands-2",
        destination: "/blogs/how-ai-shopping-assistants-are-rewiring-product-discovery-for-e-commerce-brands",
        permanent: true,
      },
      // Near-duplicate consolidation: the "Lessons From Glisser Beauty" PDP-copy
      // variant shared ~99% of its body with the canonical post (different
      // case-study dressing only). The Glisser story stays reachable through
      // its /work case study; the variant URL 301s to the canonical topic URL.
      {
        source: "/blogs/using-ai-to-write-pdp-copy-that-converts-in-beauty-skincare-lessons-from-glisser",
        destination: "/blogs/using-ai-to-write-pdp-copy-that-converts-in-beauty-skincare",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
