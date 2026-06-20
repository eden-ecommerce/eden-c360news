"use client";

import { useSearchBox } from "react-instantsearch";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";

export function SearchBox({ placeholder = "Search…" }: { placeholder?: string }) {
  const { query, refine, clear } = useSearchBox();
  const [inputValue, setInputValue] = useState(query);

  const debouncedRefine = useDebouncedCallback((value: string) => {
    refine(value);
  }, 300);

  return (
    <div className="flex items-center gap-2">
      <input
        type="search"
        value={inputValue}
        onChange={(event) => {
          const value = event.target.value;
          setInputValue(value);
          debouncedRefine(value);
        }}
        placeholder={placeholder}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        aria-label="Search"
      />
      {inputValue ? (
        <button
          type="button"
          onClick={() => {
            setInputValue("");
            clear();
          }}
          className="text-sm text-muted-foreground underline"
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}
