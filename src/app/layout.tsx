import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "QA Specialist — Shopify & Shopify Plus Quality Assurance",
    template: "%s | QA Specialist",
  },
  description:
    "Premium Quality Assurance for Shopify and Shopify Plus stores. 50+ stores tested. Functional, responsive, checkout, and accessibility QA.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "QA Specialist Portfolio",
    title: "QA Specialist — Shopify & Shopify Plus Quality Assurance",
    description:
      "I find what your store gets wrong before your customers do. 50+ stores tested. 20 Shopify Plus projects.",
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
      <body className={`${inter.variable} ${ibmPlexMono.variable}`} style={{ fontFamily: "var(--font-inter, Inter), system-ui, sans-serif" }}>
        <ThemeProvider>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
