import type { Metadata } from "next";

/**
 * Applies to every /admin route.
 *
 * The admin area is already blocked in robots.txt, but a disallow only stops
 * crawling — it does not stop a URL that is linked or guessed from appearing in
 * results. `noindex` is the directive that actually keeps it out, and it has to
 * be delivered in a response the crawler can fetch, which is why it lives here
 * as metadata rather than in robots.txt alone.
 */
export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
