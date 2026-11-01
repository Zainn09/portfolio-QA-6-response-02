import { redirect } from "next/navigation";
import { getAdminSessionForPage } from "@/lib/devtools/session";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const session = await getAdminSessionForPage();
  if (!session) {
    redirect("/admin/login");
  }
  return <AdminDashboard />;
}
