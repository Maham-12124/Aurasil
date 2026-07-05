"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    setQuery("");
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} aria-label="Search">
        <Search className="h-5 w-5" />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
      <input
        autoFocus
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => {
          if (!query.trim()) setOpen(false);
        }}
        placeholder="Search products…"
        className="h-8 w-32 border border-border bg-transparent px-2 text-sm outline-none focus:border-primary sm:w-56"
      />
      <button type="button" onClick={() => setOpen(false)} aria-label="Close search">
        <X className="h-4 w-4" />
      </button>
    </form>
  );
}
