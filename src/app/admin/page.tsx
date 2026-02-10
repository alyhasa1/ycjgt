import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  const isAuthenticated = await verifySession();
  if (isAuthenticated) {
    redirect("/admin/posts");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1B3E]">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">YCJGT Admin</h1>
          <p className="text-white/50 text-sm">Enter your admin password to continue</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
