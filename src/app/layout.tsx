import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-FQM62EBQRD";

/**
 * Site-wide entity graph.
 *
 * Search engines read these nodes to answer "who is this site, who is behind
 * it, and what do they sell" — the difference between ranking as an anonymous
 * page and ranking as a recognised entity. Page-level schema (Article,
 * BreadcrumbList, FAQPage, ItemList) is layered on top per route.
 */
const entityGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description:
        "Independent QA consultancy testing Shopify and Shopify Plus storefronts: functional, checkout, responsive, accessibility and performance testing.",
      knowsAbout: [
        "Shopify QA",
        "Shopify Plus",
        "E-commerce quality assurance",
        "Checkout testing",
        "Conversion rate optimisation",
        "Accessibility testing",
        "Core Web Vitals",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description:
        "QA case studies, Shopify testing guides and store teardowns from 100+ audited storefronts.",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Zain",
      jobTitle: "Founder & QA Lead",
      url: absoluteUrl("/about"),
      worksFor: { "@id": `${SITE_URL}/#organization` },
      knowsAbout: [
        "Shopify quality assurance",
        "Checkout testing",
        "Responsive testing",
        "Accessibility auditing",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      name: `${SITE_NAME} — Shopify QA Audits`,
      url: absoluteUrl("/audit"),
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
      areaServed: "Worldwide",
      serviceType: [
        "Shopify store QA audit",
        "Shopify Plus checkout testing",
        "E-commerce accessibility testing",
        "Conversion rate optimisation audit",
      ],
      provider: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "QA Specialist — Shopify & Shopify Plus Quality Assurance",
    template: "%s | QA Specialist",
  },
  description:
    "Premium Quality Assurance for Shopify and Shopify Plus stores. 100+ stores tested. Functional, responsive, checkout, and accessibility QA.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "QA Specialist — Blog RSS feed" },
      ],
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "QA Specialist — Shopify & Shopify Plus Quality Assurance",
    description:
      "I find what your store gets wrong before your customers do. 100+ stores tested. 20 Shopify Plus projects.",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "QA Specialist — Shopify & Shopify Plus Quality Assurance",
    description: "I find what your store gets wrong before your customers do.",
  },
  authors: [{ name: "Zain", url: absoluteUrl("/about") }],
  creator: "Zain",
  publisher: SITE_NAME,
  category: "Quality Assurance",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  // Google Search Console ownership verification (HTML meta tag method).
  // The companion DNS TXT-record method is documented in docs/google-site-verification.md
  verification: {
    google: "sFCobwdgJ47jkotq4vkO_mTo13ORcuoajMbTo7Y_O_A",
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
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4078729434854717"
          crossOrigin="anonymous"
        />
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
        <JsonLd data={entityGraph} />
        <ThemeProvider>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
