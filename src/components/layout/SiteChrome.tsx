"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import type { MegaMenuData } from "@/components/navigation/MegaMenu";

/**
 * Site chrome (Navbar + main + Footer) for public pages only.
 *
 * The private areas (/admin, /devtools) ship their own full-screen layouts —
 * the admin editor has its own sticky header and the DevTools console has its
 * own dark shell. Rendering the marketing Navbar and Footer around them made
 * the footer overlap the private chrome, so the site chrome is withheld there.
 *
 * `usePathname()` is resolved on the server for the initial paint, so there is
 * no flash of the wrong chrome during hydration.
 */
export function SiteChrome({ children, megaData }: { children: React.ReactNode; megaData: MegaMenuData }) {
  const pathname = usePathname() ?? "";
  const isPrivateArea = /^\/(admin|devtools)(\/|$)/.test(pathname);

  if (isPrivateArea) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar megaData={megaData} />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
