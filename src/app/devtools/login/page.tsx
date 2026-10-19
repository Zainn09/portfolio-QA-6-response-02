import type { Metadata } from "next";
import { DevToolsLogin } from "@/components/devtools/DevToolsLogin";

export const metadata: Metadata = {
  title: "Sign in · DevTools",
  robots: { index: false, follow: false },
};

export default function DevToolsLoginPage() {
  return <DevToolsLogin />;
}
