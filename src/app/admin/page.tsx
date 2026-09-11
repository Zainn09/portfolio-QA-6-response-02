import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin-session");
    if (!session) return null;
    return JSON.parse(session.value);
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return <AdminDashboard />;
}
