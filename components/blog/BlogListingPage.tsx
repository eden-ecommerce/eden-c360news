"use client";

import { type Article, type ArticleCategory } from "@lib/sanity/get-articles";
import { CategoryFilter } from "@components/blog/CategoryFilter";
import { ArticleGrid } from "@components/blog/ArticleGrid";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type BlogListingPageProps = {
  articles: Article[];
  categories: ArticleCategory[];
};

export function BlogListingPage({ articles, categories }: BlogListingPageProps) {
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("category") || null;

  const filtered = useMemo(() => {
    if (!activeSlug) return articles;
    return articles.filter((a) =>
      a.categories.some((c) => c.slug === activeSlug),
    );
  }, [articles, activeSlug]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <header className="mb-10 border-b border-border pb-8">
        <h1 className="text-4xl font-bold text-foreground tracking-tight text-balance">
          Articles
        </h1>
        <p className="mt-3 text-muted-foreground text-base leading-relaxed max-w-2xl">
          Encouraging and equipping Christians across the UK.
        </p>
      </header>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mb-8">
          <CategoryFilter categories={categories} activeSlug={activeSlug} />
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-6">
        {filtered.length === 1
          ? "1 article"
          : `${filtered.length} articles`}
        {activeSlug && (
          <>
            {" "}in{" "}
            <span className="font-medium text-foreground">
              {categories.find((c) => c.slug === activeSlug)?.title ?? activeSlug}
            </span>
          </>
        )}
      </p>

      {/* Grid */}
      <ArticleGrid articles={filtered} />
    </main>
  );
}
