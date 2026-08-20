import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--color-primary)" }}
            >
              a<span style={{ color: "var(--color-accent)" }}>IQ</span>
            </span>
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Graph-powered automation intelligence for enterprise teams.
            </p>
          </div>

          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Navigate
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/dashboard", label: "Dashboard" },
                { href: "/explorer", label: "Graph Explorer" },
                { href: "/impact", label: "Impact Analysis" },
                { href: "/agents", label: "Agent Load" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Technology
            </h4>
            <ul className="space-y-2">
              {["CognoDB", "Express.js", "Next.js", "openCypher"].map((tech) => (
                <li
                  key={tech}
                  className="text-sm"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Powered By
            </h4>
            <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
              CognoDB Graph Database
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-tertiary)" }}>
              Neo4j Bolt Protocol
            </p>
          </div>
        </div>

        <div
          className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
            AutomatIQ — Take-home Assessment
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
            Built with CognoDB, Express.js & Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
