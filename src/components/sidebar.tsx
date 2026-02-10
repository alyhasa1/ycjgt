"use client";

import { useState } from "react";
import { Home, FolderOpen, Settings, PanelRightOpen, X, User } from "lucide-react";
import Image from "next/image";

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: FolderOpen, label: "Projects", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 shadow-lg backdrop-blur-sm md:hidden"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-navy" />
        ) : (
          <PanelRightOpen className="h-5 w-5 text-navy" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[72px] flex flex-col items-center justify-between py-6 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(240,244,248,0.8) 100%)",
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
              onClick={() => setIsOpen(false)}
              className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 cursor-pointer ${
                item.active
                  ? "glass shadow-md shadow-primary/10 text-primary"
                  : "text-navy/40 hover:text-navy/60 hover:bg-white/40"
              }`}
            >
              <item.icon className="h-[18px] w-[18px]" strokeWidth={item.active ? 2.2 : 1.8} />
              <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-navy px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1 md:block hidden">
                {item.label}
              </span>
              {item.active && (
                <div className="absolute -left-[2px] h-5 w-1 rounded-r-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/[0.06] text-navy/50 hover:bg-navy/[0.1] hover:text-navy/70 cursor-pointer transition-colors">
            <User className="h-[18px] w-[18px]" />
          </button>
        </div>
      </aside>
    </>
  );
}
