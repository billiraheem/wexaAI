"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Network,
  ShieldAlert,
  Users,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/explorer", label: "Graph Explorer", icon: Network },
  { href: "/impact", label: "Impact Analysis", icon: ShieldAlert },
  { href: "/agents", label: "Agent Load", icon: Users },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--color-surface)]/80 backdrop-blur-xl border-b border-[var(--color-border)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1 group">
              <span className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-primary)" }}>
                a<span style={{ color: "var(--color-accent)" }}>IQ</span>
              </span>
            </Link>

            {/* Desktop Nav Icons */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <div key={item.href} className="relative group">
                    <Link
                      href={item.href}
                      className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
                        isActive
                          ? "bg-[var(--color-primary-light)]"
                          : "hover:bg-[var(--color-primary-lighter)]"
                      }`}
                      style={{
                        color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </Link>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-[var(--color-text)] text-[var(--color-text-inverse)] text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {item.label}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--color-text)] rotate-45" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={toggle}
                className="p-2 rounded-xl hover:bg-[var(--color-primary-lighter)] transition-colors"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <div className="w-px h-6 bg-[var(--color-border)]" />
              <button className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: "var(--color-text-secondary)" }}>
                Sign in
              </button>
              <button
                className="text-sm font-medium px-4 py-2 rounded-xl transition-all hover:opacity-90"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-text-inverse)",
                }}
              >
                Sign up
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div
            className="absolute top-16 left-0 right-0 border-b animate-slide-up p-4 space-y-1"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? "bg-[var(--color-primary-light)]" : ""
                  }`}
                  style={{
                    color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                  }}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-3 mt-3 flex items-center gap-3" style={{ borderTop: "1px solid var(--color-border)" }}>
              <button
                onClick={toggle}
                className="p-2 rounded-xl hover:bg-[var(--color-primary-lighter)] transition-colors"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <button className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                Sign in
              </button>
              <button
                className="text-sm font-medium px-4 py-2 rounded-xl ml-auto"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-text-inverse)",
                }}
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
