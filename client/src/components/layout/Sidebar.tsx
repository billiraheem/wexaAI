"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Network,
  ShieldAlert,
  Users,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/explorer", label: "Graph Explorer", icon: Network },
  { href: "/impact", label: "Impact Analysis", icon: ShieldAlert },
  { href: "/agents", label: "Agent Load", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-gray-950/80 backdrop-blur-xl border-r border-white/[0.06] flex flex-col">
      <div className="p-6 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Automat<span className="text-violet-400">IQ</span>
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              Automation Intelligence
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-violet-600/15 text-violet-300 border border-violet-500/20 shadow-lg shadow-violet-500/5"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-violet-400" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/[0.06]">
        <div className="px-4 py-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Powered by</p>
          <p className="text-xs text-gray-400">CognoDB Graph Database</p>
        </div>
      </div>
    </aside>
  );
}
