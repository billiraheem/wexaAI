"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface SelectDropdownProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function SelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  icon,
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("[data-option]");
      items[highlightedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          onChange(options[highlightedIndex].value);
          close();
        } else {
          setIsOpen(true);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : options.length - 1
          );
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all duration-200 text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "var(--color-bg)",
          borderColor: isOpen ? "var(--color-primary)" : "var(--color-border)",
          color: selectedOption ? "var(--color-text)" : "var(--color-text-tertiary)",
          boxShadow: isOpen ? "0 0 0 2px var(--color-primary-light)" : "none",
        }}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="flex-1 truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          style={{ color: "var(--color-text-tertiary)" }}
        />
      </button>

      {isOpen && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-1.5 rounded-xl border overflow-hidden animate-scale-in"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            maxHeight: "240px",
            overflowY: "auto",
          }}
        >
          {options.length === 0 ? (
            <div
              className="px-4 py-3 text-sm"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              No options available
            </div>
          ) : (
            options.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlightedIndex;
              return (
                <button
                  key={option.value}
                  type="button"
                  data-option
                  onClick={() => {
                    onChange(option.value);
                    close();
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors cursor-pointer"
                  style={{
                    backgroundColor: isHighlighted
                      ? "var(--color-surface-hover)"
                      : isSelected
                        ? "var(--color-primary-lighter)"
                        : "transparent",
                    color: "var(--color-text)",
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <span className="block truncate">{option.label}</span>
                    {option.sublabel && (
                      <span
                        className="block text-xs truncate mt-0.5"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        {option.sublabel}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <Check
                      className="w-4 h-4 shrink-0"
                      style={{ color: "var(--color-primary)" }}
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
