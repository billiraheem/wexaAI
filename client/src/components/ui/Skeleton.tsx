export function CardSkeleton() {
  return (
    <div
      className="rounded-2xl border p-6 animate-pulse"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="h-10 w-10 rounded-xl mb-4" style={{ backgroundColor: "var(--color-bg-alt)" }} />
      <div className="h-8 w-16 rounded mb-2" style={{ backgroundColor: "var(--color-bg-alt)" }} />
      <div className="h-4 w-24 rounded" style={{ backgroundColor: "var(--color-bg-alt)" }} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="p-4 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="h-4 w-48 rounded animate-pulse" style={{ backgroundColor: "var(--color-bg-alt)" }} />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4 border-b last:border-0" style={{ borderColor: "var(--color-border)" }}>
          <div className="h-8 w-8 rounded-lg animate-pulse" style={{ backgroundColor: "var(--color-bg-alt)" }} />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 rounded animate-pulse" style={{ backgroundColor: "var(--color-bg-alt)" }} />
            <div className="h-3 w-24 rounded animate-pulse" style={{ backgroundColor: "var(--color-bg-alt)" }} />
          </div>
          <div className="h-4 w-16 rounded animate-pulse" style={{ backgroundColor: "var(--color-bg-alt)" }} />
        </div>
      ))}
    </div>
  );
}

export function GraphSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "var(--color-bg-alt)" }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-primary)" }} />
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          Loading graph data...
        </p>
      </div>
    </div>
  );
}
