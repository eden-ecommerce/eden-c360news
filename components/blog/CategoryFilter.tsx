"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

type CategoryFilterProps = {
  tags: string[];
  activeTag: string | null;
};

export function CategoryFilter({ tags, activeTag }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const setTag = useCallback(
    (tag: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tag) {
        params.set("tag", tag);
      } else {
        params.delete("tag");
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, pathname],
  );

  if (tags.length === 0) return null;

  return (
    <nav aria-label="Filter news by topic">
      <ul className="flex flex-wrap gap-x-1 gap-y-1">
        <li>
          <button
            type="button"
            onClick={() => setTag(null)}
            aria-pressed={activeTag === null}
            className={[
              "px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors",
              activeTag === null
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            ].join(" ")}
          >
            All
          </button>
        </li>

        {tags.map((tag) => (
          <li key={tag}>
            <button
              type="button"
              onClick={() => setTag(tag)}
              aria-pressed={activeTag === tag}
              className={[
                "px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors",
                activeTag === tag
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              ].join(" ")}
            >
              {tag}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
