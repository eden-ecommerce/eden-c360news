"use client";

import { type ArticleCategory } from "@lib/sanity/get-articles";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

type CategoryFilterProps = {
  categories: ArticleCategory[];
  activeSlug: string | null;
};

export function CategoryFilter({ categories, activeSlug }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const setCategory = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug) {
        params.set("category", slug);
      } else {
        params.delete("category");
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, pathname],
  );

  if (categories.length === 0) return null;

  return (
    <nav aria-label="Filter articles by category">
      <ul className="flex flex-wrap gap-2">
        {/* "All" pill */}
        <li>
          <button
            type="button"
            onClick={() => setCategory(null)}
            aria-pressed={activeSlug === null}
            className={[
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              activeSlug === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            ].join(" ")}
          >
            All
          </button>
        </li>

        {categories.map((cat) => (
          <li key={cat.id}>
            <button
              type="button"
              onClick={() => setCategory(cat.slug)}
              aria-pressed={activeSlug === cat.slug}
              className={[
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                activeSlug === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              ].join(" ")}
            >
              {cat.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
