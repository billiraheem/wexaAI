import { InboxIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-4" style={{ color: "var(--color-text-tertiary)" }}>
        {icon || <InboxIcon className="w-12 h-12" />}
      </div>
      <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--color-text-secondary)" }}>
        {title}
      </h3>
      <p className="text-sm text-center max-w-sm" style={{ color: "var(--color-text-tertiary)" }}>
        {description}
      </p>
    </div>
  );
}
