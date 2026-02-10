"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "../actions";
import { FileText, FolderOpen, LogOut, LayoutDashboard } from "lucide-react";

const navItems = [
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/posts/new", label: "New Post", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-1">
            <Link
              href="/admin/posts"
              className="text-white font-bold text-lg mr-8"
            >
              YCJGT Admin
            </Link>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin/posts" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#4FC3F7]/20 text-[#4FC3F7]"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              target="_blank"
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              View Blog →
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-red-400 hover:bg-white/5 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
