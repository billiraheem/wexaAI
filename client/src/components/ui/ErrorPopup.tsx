"use client";

import { AlertTriangle, X, RefreshCw } from "lucide-react";

interface ErrorPopupProps {
  message: string;
  onRetry?: () => void;
  onClose: () => void;
}

export function ErrorPopup({ message, onRetry, onClose }: ErrorPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative max-w-md w-full rounded-2xl border p-6 shadow-2xl animate-scale-in"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition-colors hover:opacity-80"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className="p-2.5 rounded-xl shrink-0"
            style={{ backgroundColor: "var(--color-primary-light)" }}
          >
            <AlertTriangle className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--color-text)" }}>
              Something went wrong
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
              {message}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-text-inverse)",
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
