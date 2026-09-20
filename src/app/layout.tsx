import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";

export const metadata: Metadata = {
  title: {
    default: "QA Specialist — Shopify & Shopify Plus Quality Assurance",
    template: "%s | QA Specialist",
  },
  description:
    "Premium Quality Assurance for Shopify and Shopify Plus stores. 100+ stores tested. Functional, responsive, checkout, and accessibility QA.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "QA Specialist Portfolio",
    title: "QA Specialist — Shopify & Shopify Plus Quality Assurance",
    description:
      "I find what your store gets wrong before your customers do. 100+ stores tested. 20 Shopify Plus projects.",
  },
  twitter: {
    card: "summary_large_image",
    title: "QA Specialist — Shopify & Shopify Plus Quality Assurance",
    description: "I find what your store gets wrong before your customers do.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Brand fonts load progressively: exact type when online,
            graceful system-font fallback when offline. */}
        <meta name="theme-color" content="#F5F3ED" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('qa-theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body style={{ fontFamily: "var(--font-sans)" }}>
        <ThemeProvider>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
