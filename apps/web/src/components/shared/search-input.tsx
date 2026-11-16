"use client";

import { Search } from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SEARCH_DEBOUNCE_MS = 300;

interface SearchInputProps {
  /** Current search from the URL. */
  value: string;
  /** Called about 300 ms after typing stops; undefined for an empty search. */
  onSearch: (query: string | undefined) => void;
  placeholder: string;
  className?: string;
}

/** Search field with debounce that stays in sync with a search param in the URL. */
export function SearchInput({ value, onSearch, placeholder, className }: SearchInputProps) {
  const [search, setSearch] = useState(value);
  // Last value this input sent, to tell our own URL updates apart from outside ones.
  const [sentQuery, setSentQuery] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  // Sync the input when the URL changes from outside (Clear filters, back/forward).
  if (value !== prevValue) {
    setPrevValue(value);
    if (value !== sentQuery.trim()) {
      setSearch(value);
      setSentQuery(value);
    }
  }

  // The latest onSearch, without restarting the debounce when the parent re-renders.
  const emitSearch = useEffectEvent((query: string | undefined) => onSearch(query));

  useEffect(() => {
    if (search === sentQuery) return;
    const timeout = setTimeout(() => {
      setSentQuery(search);
      emitSearch(search.trim() || undefined);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [search, sentQuery]);

  return (
    <div className={cn("relative w-full sm:max-w-xs", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder.replace(/\.+$/, "")}
        className="h-10 bg-card pl-9"
      />
    </div>
  );
}
