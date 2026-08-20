"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldAlert, ArrowRight } from "lucide-react";

interface SpotlightCardProps {
  topSystem: {
    name: string;
    type: string;
    vendor: string;
    dependentTasks: number;
    affectedWorkflows: number;
  } | null;
  loading: boolean;
}

export function SpotlightCard({ topSystem, loading }: SpotlightCardProps) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border min-h-[280px]"
      style={{ borderColor: "var(--color-border)" }}
    >
      <Image
        src="/spotlight-bg.png"
        alt=""
        fill
        className="object-cover opacity-30 dark:opacity-40"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-[#0D0D0D]/40" />
      <div className="relative h-full p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="text-[10px] uppercase tracking-widest text-red-400/90 font-medium">
              Highest Impact
            </span>
          </div>
          {loading ? (
            <div className="space-y-3">
              <div className="h-6 bg-white/10 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse" />
            </div>
          ) : topSystem ? (
            <>
              <h3 className="text-2xl font-bold text-white mb-1">
                {topSystem.name}
              </h3>
              <p className="text-sm text-gray-400">
                {topSystem.type} • {topSystem.vendor}
              </p>
            </>
          ) : null}
        </div>

        {topSystem && (
          <div className="flex gap-3 mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
              <p className="text-2xl font-bold text-white">
                {topSystem.dependentTasks}
              </p>
              <p className="text-[10px] text-gray-300 uppercase tracking-wider">
                Tasks
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
              <p className="text-2xl font-bold text-white">
                {topSystem.affectedWorkflows}
              </p>
              <p className="text-[10px] text-gray-300 uppercase tracking-wider">
                Workflows
              </p>
            </div>
          </div>
        )}

        <Link
          href="/impact"
          className="mt-3 inline-flex items-center gap-2 text-sm text-red-300 hover:text-red-200 transition-colors"
        >
          Run impact analysis <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
