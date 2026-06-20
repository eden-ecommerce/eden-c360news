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
    <nav aria-label="Filter articles by tag">
      <ul className="flex flex-wrap gap-2">
        <li>
          <button
            type="button"
            onClick={() => setTag(null)}
            aria-pressed={activeTag === null}
            className={[
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              activeTag === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
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
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                activeTag === tag
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
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
