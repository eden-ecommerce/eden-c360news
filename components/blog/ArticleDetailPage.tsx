import { type Article } from "@lib/sanity/get-articles";
import { PortableText } from "@components/ui/PortableText";
import type { AlgoliaProductHit } from "@lib/algolia/fetch-products-by-isbn";
import Image from "next/image";
import Link from "next/link";

type ArticleDetailPageProps = {
  article: Article;
  carouselProductMap?: Map<string, AlgoliaProductHit[]>;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ArticleDetailPage({ article, carouselProductMap }: ArticleDetailPageProps) {
  const heroUrl = article.thumbnailUrlHero;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Back link */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/blog"
          className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
        >
          <span aria-hidden>&#8592;</span>
          <span>All articles</span>
        </Link>
      </nav>

      {/* Tag labels */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="text-xs font-medium uppercase tracking-wider text-primary hover:underline"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight text-balance mb-4">
        {article.title}
      </h1>

      {/* Metadata row */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
        {article.publishedAt && (
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        )}
      </div>

      {/* Hero image */}
      {heroUrl && (
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-8 bg-muted">
          <Image
            src={heroUrl}
            alt={article.thumbnail?.alt ?? article.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      {/* Excerpt lead */}
      {article.excerpt && (
        <p className="text-xl text-muted-foreground leading-relaxed mb-8 font-light">
          {article.excerpt}
        </p>
      )}

      {/* Body */}
      {article.richText && article.richText.length > 0 ? (
        <div className="prose prose-lg prose-headings:font-semibold prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground max-w-none">
          <PortableText
            value={article.richText}
            carouselProductMap={carouselProductMap}
          />
        </div>
      ) : (
        <p className="text-muted-foreground">No content available for this article.</p>
      )}
    </main>
  );
}
