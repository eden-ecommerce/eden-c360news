"use client";

import { type Article } from "@lib/sanity/get-articles";
import { CategoryFilter } from "@components/blog/CategoryFilter";
import { ArticleGrid } from "@components/blog/ArticleGrid";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type BlogListingPageProps = {
  articles: Article[];
  tags: string[];
};

export function BlogListingPage({ articles, tags }: BlogListingPageProps) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") || null;

  const filtered = useMemo(() => {
    if (!activeTag) return articles;
    return articles.filter((a) => a.tags.includes(activeTag));
  }, [articles, activeTag]);

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

      {/* Tag filter */}
      {tags.length > 0 && (
        <div className="mb-8">
          <CategoryFilter tags={tags} activeTag={activeTag} />
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-6">
        {filtered.length === 1 ? "1 article" : `${filtered.length} articles`}
        {activeTag && (
          <>
            {" "}tagged{" "}
            <span className="font-medium text-foreground">{activeTag}</span>
          </>
        )}
      </p>

      {/* Grid */}
      <ArticleGrid articles={filtered} />
    </main>
  );
}
