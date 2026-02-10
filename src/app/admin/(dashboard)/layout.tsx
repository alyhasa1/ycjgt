import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminNav } from "./admin-nav";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await verifySession();
  if (!isAuthenticated) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-[#0D1B3E]">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
