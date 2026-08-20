"use client";

import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Network,
  ShieldAlert,
  Users,
  CheckCircle2,
  ArrowRight,
  Zap,
  Database,
  TrendingUp,
} from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description:
      "Real-time overview of agents, workflows, systems, and pipelines with interactive Recharts visualizations.",
    href: "/dashboard",
  },
  {
    icon: Network,
    title: "Graph Explorer",
    description:
      "Interactive force-directed graph to visually explore your entire automation landscape. Click any node to inspect.",
    href: "/explorer",
  },
  {
    icon: ShieldAlert,
    title: "Impact Analysis",
    description:
      "Multi-hop traversal queries: if a system goes down, instantly see every affected workflow, agent, and task.",
    href: "/impact",
  },
  {
    icon: Users,
    title: "Agent Load",
    description:
      "Ranked workload view of AI agents with task counts, workflow assignments, and detail drill-downs.",
    href: "/agents",
  },
];

const TRUST_ITEMS = [
  "Multi-hop impact analysis",
  "Real-time graph queries",
  "Built on CognoDB",
];

const STATS = [
  { value: "117+", label: "Graph Entities", accent: false },
  { value: "6", label: "Relationship Types", accent: true },
  { value: "<50ms", label: "Query Time", accent: false },
];

function AnimatedGraphBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const isDark = theme === "dark";

    const nodeCount = 40;
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }[] = [];

    const colors = isDark
      ? ["#D4567E", "#E88AA0", "#60A5FA", "#4ADE80", "#F59E0B", "#A09890"]
      : ["#7C1D2E", "#C4416A", "#4A6FA5", "#2D7A4F", "#B8860B", "#6B6560"];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const connectionDistance = 120;

    function animate() {
      ctx!.clearRect(0, 0, width, height);

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * (isDark ? 0.12 : 0.08);
            ctx!.beginPath();
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
            ctx!.strokeStyle = isDark
              ? `rgba(212, 86, 126, ${alpha})`
              : `rgba(124, 29, 46, ${alpha})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      for (const node of nodes) {
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx!.fillStyle = node.color;
        ctx!.globalAlpha = 0.6;
        ctx!.fill();
        ctx!.globalAlpha = 1;

        ctx!.beginPath();
        ctx!.arc(node.x, node.y, node.radius + 3, 0, Math.PI * 2);
        ctx!.fillStyle = node.color;
        ctx!.globalAlpha = 0.08;
        ctx!.fill();
        ctx!.globalAlpha = 1;
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.5 }}
    />
  );
}

export default function LandingPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: "calc(100vh - 4rem)",
          backgroundColor: "var(--color-bg)",
        }}
      >
        <AnimatedGraphBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center"
          style={{ minHeight: "calc(100vh - 4rem)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 lg:py-0">
            {/* Left: Headline + CTAs */}
            <div
              className={`space-y-8 ${mounted ? "animate-slide-up" : "opacity-0"}`}
            >
              <div>
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
                  style={{ color: "var(--color-text)" }}
                >
                  Map Your
                  <br />
                  <span style={{ color: "var(--color-primary)" }}>
                    Automation.
                  </span>
                  <br />
                  See Every
                  <br />
                  <span style={{ color: "var(--color-accent)" }}>
                    Dependency
                  </span>
                  <br />
                  <span
                    style={{
                      color: "var(--color-text-secondary)",
                      fontWeight: 400,
                      fontSize: "0.75em",
                    }}
                  >
                    Before It Breaks.
                  </span>
                </h1>
              </div>

              {/* Trust checklist */}
              <ul className="space-y-2.5">
                {TRUST_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm font-medium"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <CheckCircle2
                      className="w-4 h-4 shrink-0"
                      style={{ color: "var(--color-primary)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-text-inverse)",
                  }}
                >
                  Explore Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://github.com/billiraheem/wexaAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold border transition-all duration-200 hover:opacity-80"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                    backgroundColor: "transparent",
                  }}
                >
                  <GithubIcon className="w-4 h-4" />
                  View on GitHub
                </a>
              </div>
            </div>

            {/* Right: Stat cards (stacked vertically on mobile, overlapping visually) */}
            <div
              className={`flex flex-col gap-4 ${mounted ? "animate-slide-up" : "opacity-0"}`}
              style={{ animationDelay: "0.15s", animationFillMode: "both" }}
            >
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    backgroundColor: stat.accent
                      ? "var(--color-primary-light)"
                      : "var(--color-surface)",
                    borderColor: stat.accent
                      ? "var(--color-primary)"
                      : "var(--color-border)",
                    transform: `translateX(${i * 12}px)`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: stat.accent
                          ? "var(--color-primary)"
                          : "var(--color-primary-light)",
                      }}
                    >
                      {i === 0 && (
                        <Database
                          className="w-5 h-5"
                          style={{
                            color: stat.accent
                              ? "var(--color-text-inverse)"
                              : "var(--color-primary)",
                          }}
                        />
                      )}
                      {i === 1 && (
                        <Zap
                          className="w-5 h-5"
                          style={{
                            color: stat.accent
                              ? "var(--color-text-inverse)"
                              : "var(--color-primary)",
                          }}
                        />
                      )}
                      {i === 2 && (
                        <TrendingUp
                          className="w-5 h-5"
                          style={{
                            color: stat.accent
                              ? "var(--color-text-inverse)"
                              : "var(--color-primary)",
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className="text-3xl font-bold"
                        style={{
                          color: stat.accent
                            ? "var(--color-primary)"
                            : "var(--color-text)",
                        }}
                      >
                        {stat.value}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gradient fade at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: `linear-gradient(to top, var(--color-bg), transparent)`,
          }}
        />
      </section>

      {/* ─── Feature Preview Section ─── */}
      <section
        className="py-20"
        style={{ backgroundColor: "var(--color-bg-alt)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-3"
              style={{ color: "var(--color-text)" }}
            >
              Everything You Need to Understand
              <br />
              <span style={{ color: "var(--color-primary)" }}>
                Your Automation Landscape
              </span>
            </h2>
            <p
              className="text-sm max-w-2xl mx-auto"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Four purpose-built views powered by graph queries, each answering a
              different question your ops team actually asks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] hover:border-[var(--color-primary)]"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-text-inverse)]"
                    style={{
                      backgroundColor: "var(--color-primary-light)",
                      color: "var(--color-primary)",
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3
                    className="text-base font-semibold mb-2"
                    style={{ color: "var(--color-text)" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {feature.description}
                  </p>
                  <div
                    className="mt-4 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Explore
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-16" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ color: "var(--color-text)" }}
          >
            Ready to explore?
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Dive into the dashboard to see 117+ graph entities, 6 relationship
            types, and 5 core query patterns in action.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-inverse)",
            }}
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
