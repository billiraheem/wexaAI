"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";

export interface ComboboxOption {
  value: string;
  label: string;
  group: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Search...",
  disabled = false,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    if (!query) return options;
    const lower = query.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(lower) ||
        o.group.toLowerCase().includes(lower)
    );
  }, [options, query]);

  const grouped = useMemo(() => {
    const groups: Record<string, ComboboxOption[]> = {};
    for (const opt of filtered) {
      if (!groups[opt.group]) groups[opt.group] = [];
      groups[opt.group].push(opt);
    }
    return groups;
  }, [filtered]);

  const flatFiltered = useMemo(() => filtered, [filtered]);

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (!value) setQuery("");
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
        if (selectedOption) setQuery(selectedOption.label);
        else setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close, selectedOption]);

  useEffect(() => {
    if (selectedOption && !isOpen) {
      setQuery(selectedOption.label);
    }
  }, [selectedOption, isOpen]);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("[data-option]");
      items[highlightedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    const opt = options.find((o) => o.value === optionValue);
    if (opt) setQuery(opt.label);
    close();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < flatFiltered.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : flatFiltered.length - 1
          );
        }
        break;
      case "Enter":
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && flatFiltered[highlightedIndex]) {
          handleSelect(flatFiltered[highlightedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        if (selectedOption) setQuery(selectedOption.label);
        else setQuery("");
        break;
    }
  };

  const highlightMatch = (text: string) => {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>
          {text.slice(idx, idx + query.length)}
        </span>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200"
        style={{
          backgroundColor: "var(--color-bg)",
          borderColor: isOpen ? "var(--color-primary)" : "var(--color-border)",
          boxShadow: isOpen ? "0 0 0 2px var(--color-primary-light)" : "none",
        }}
      >
        <Search
          className="w-4 h-4 shrink-0"
          style={{ color: "var(--color-text-tertiary)" }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
            if (!e.target.value) onChange("");
          }}
          onFocus={() => {
            setIsOpen(true);
            setQuery("");
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-text-tertiary)]"
          style={{ color: "var(--color-text)" }}
        />
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          style={{ color: "var(--color-text-tertiary)" }}
        />
      </div>

      {isOpen && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-1.5 rounded-xl border overflow-hidden animate-scale-in"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            maxHeight: "280px",
            overflowY: "auto",
          }}
        >
          {flatFiltered.length === 0 ? (
            <div
              className="px-4 py-3 text-sm"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              No matches found
            </div>
          ) : (
            Object.entries(grouped).map(([groupName, groupOptions]) => (
              <div key={groupName}>
                <div
                  className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider sticky top-0"
                  style={{
                    color: "var(--color-text-tertiary)",
                    backgroundColor: "var(--color-bg-alt)",
                  }}
                >
                  {groupName}
                </div>
                {groupOptions.map((option) => {
                  const globalIndex = flatFiltered.indexOf(option);
                  const isSelected = option.value === value;
                  const isHighlighted = globalIndex === highlightedIndex;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      data-option
                      onClick={() => handleSelect(option.value)}
                      onMouseEnter={() => setHighlightedIndex(globalIndex)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors cursor-pointer"
                      style={{
                        backgroundColor: isHighlighted
                          ? "var(--color-surface-hover)"
                          : isSelected
                            ? "var(--color-primary-lighter)"
                            : "transparent",
                        color: "var(--color-text)",
                      }}
                    >
                      <span className="flex-1 truncate">
                        {highlightMatch(option.label)}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
