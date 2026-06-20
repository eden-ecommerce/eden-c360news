"use client";

import { type Article } from "@lib/sanity/get-articles";
import { ArticleGrid } from "@components/blog/ArticleGrid";
import { HeroArticle } from "@components/blog/HeroArticle";

type BlogListingPageProps = {
  articles: Article[];
};

function formatMastheadDate(): string {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogListingPage({ articles }: BlogListingPageProps) {
  const heroArticle = articles.length > 0 ? articles[0] : null;
  const remainingArticles = heroArticle ? articles.slice(1) : articles;

  return (
    <main>
      {/* Masthead */}
      <div className="bg-foreground text-background border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight uppercase font-sans text-background">
              Christian News
            </h1>
            <p className="text-xs text-background/60 tracking-widest uppercase mt-0.5">
              Eden.co.uk &mdash; Encouraging Christians across the UK
            </p>
          </div>
          <time className="text-xs text-background/50 tracking-wider uppercase hidden sm:block">
            {formatMastheadDate()}
          </time>
        </div>
      </div>

      {/* Hero story */}
      {heroArticle && (
        <div className="border-b border-border">
          <HeroArticle article={heroArticle} />
        </div>
      )}

      {/* Article grid section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section heading */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-foreground">
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground">
            Latest News
          </h2>
          <span className="text-xs text-muted-foreground">
            {remainingArticles.length === 1
              ? "1 story"
              : `${remainingArticles.length} stories`}
          </span>
        </div>

        <ArticleGrid articles={remainingArticles} />
      </div>
    </main>
  );
}
