"use client";

import { useEffect, useState } from "react";
import { Home, FolderOpen, Settings, User, ListPlus } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: FolderOpen, label: "Projects", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open sidebar"
          aria-expanded={false}
          aria-controls="main-sidebar"
          className="fixed left-0 top-[max(1rem,env(safe-area-inset-top))] z-[60] flex h-11 w-11 items-center justify-center rounded-r-2xl border border-l-0 border-white/70 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-white md:hidden"
        >
          <ListPlus className="h-5 w-5 text-navy/70" strokeWidth={2.1} />
        </button>
      )}

      {/* Overlay for mobile */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-navy/30 backdrop-blur-[3px] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="main-sidebar"
        className={cn(
          "fixed left-0 top-0 z-50 flex h-[100svh] w-[244px] flex-col justify-between px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] transition-transform duration-300 supports-[height:100dvh]:h-[100dvh] md:w-[72px] md:px-2 md:pb-6 md:pt-6",
          isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none",
          "md:translate-x-0 md:pointer-events-auto",
        )}
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(240,244,248,0.8) 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRight: "1px solid rgba(255,255,255,0.4)",
        }}
      >
        <div className="flex flex-col gap-3 md:items-center">
          {/* Logo */}
          <div className="mb-1 flex h-11 w-full items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 md:mb-6 md:w-11">
            <Image src="/ycjgt.png" alt="YCJGT" width={40} height={40} className="object-contain" />
            <span className="text-[11px] font-semibold tracking-[0.08em] text-navy/40 md:hidden">YCJGT</span>
          </div>

          {/* Nav Icons */}
          <div className="rounded-xl border border-white/70 bg-white/45 p-1.5 md:w-full md:rounded-none md:border-0 md:bg-transparent md:p-0">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.label}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group relative flex h-11 w-full items-center gap-3 rounded-xl px-3 transition-all duration-200 cursor-pointer md:mx-auto md:w-11 md:justify-center md:rounded-xl md:px-0",
                  item.active
                    ? "glass text-primary ring-1 ring-primary/20"
                    : "text-navy/45 hover:text-navy/65 hover:bg-white/60",
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={item.active ? 2.2 : 1.8} />
                <span className="text-[13px] font-medium text-navy/65 md:hidden">{item.label}</span>
                <span className="pointer-events-none absolute left-full ml-3 hidden -translate-x-1 whitespace-nowrap rounded-lg bg-navy px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100 md:block">
                  {item.label}
                </span>
                {item.active && (
                  <div className="absolute left-[6px] top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary md:-left-[2px]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/60 pt-3 md:items-center md:border-0 md:pt-0">
          <button
            type="button"
            className="flex h-11 w-full items-center gap-3 rounded-xl border border-transparent bg-navy/[0.06] px-3 text-navy/55 transition-colors hover:border-white/70 hover:bg-navy/[0.09] hover:text-navy/75 cursor-pointer md:mx-auto md:h-10 md:w-10 md:justify-center md:px-0"
          >
            <User className="h-[18px] w-[18px] shrink-0" />
            <span className="text-[13px] font-medium text-navy/65 md:hidden">Profile</span>
          </button>
        </div>
      </aside>
    </>
  );
}
