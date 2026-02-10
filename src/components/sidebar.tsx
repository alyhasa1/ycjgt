"use client";

import { Home, FolderOpen, Settings, Sparkles } from "lucide-react";
import Image from "next/image";

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: FolderOpen, label: "Projects", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-0 z-50 hidden h-full w-[72px] flex-col items-center justify-between py-6 md:flex"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(240,244,248,0.3) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRight: "1px solid rgba(255,255,255,0.4)",
      }}
    >
      <div className="flex flex-col items-center gap-2">
        {/* Logo */}
        <div className="mb-6 flex h-11 w-11 items-center justify-center cursor-pointer hover:scale-105 transition-transform">
          <Image src="/ycjgt.png" alt="YCJGT" width={40} height={40} className="object-contain" />
        </div>

        {/* Nav Icons */}
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 cursor-pointer ${
              item.active
                ? "glass shadow-md shadow-primary/10 text-primary"
                : "text-navy/40 hover:text-navy/60 hover:bg-white/40"
            }`}
          >
            <item.icon className="h-[18px] w-[18px]" strokeWidth={item.active ? 2.2 : 1.8} />
            <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-navy px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1">
              {item.label}
            </span>
            {item.active && (
              <div className="absolute -left-[2px] h-5 w-1 rounded-r-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-xl text-primary/40 hover:text-primary cursor-pointer transition-colors">
        <Sparkles className="h-[18px] w-[18px]" />
      </div>
    </aside>
  );
}
