"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";

export default function SearchInput({
  placeholder = "Cari...",
  defaultValue = "",
  onSubmit,
}: {
  placeholder?: string;
  defaultValue?: string;
  onSubmit?: (query: string) => void;
}) {
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit?.(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <div className="flex w-full items-center gap-2 rounded-full border border-line bg-secondary px-4 py-2 transition focus-within:border-primary">
        <Search size={16} className="shrink-0 text-muted" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
        />
      </div>
    </form>
  );
}
