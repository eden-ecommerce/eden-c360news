import { type Article } from "@lib/sanity/get-articles";
import { PortableText } from "@components/ui/PortableText";
import type { AlgoliaProductHit } from "@lib/algolia/fetch-products-by-isbn";
import { NAMESPACE_PATH } from "@lib/config";
import Image from "next/image";
import Link from "next/link";

type ArticleDetailPageProps = {
  article: Article;
  carouselProductMap?: Map<string, AlgoliaProductHit[]>;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ArticleDetailPage({ article, carouselProductMap }: ArticleDetailPageProps) {
  const heroUrl = article.thumbnailUrlHero;
  const primaryTag = article.tags[0] ?? null;

  return (
    <main>
      {/* Article header band */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Link href={NAMESPACE_PATH} className="hover:text-primary transition-colors font-medium uppercase tracking-wider">
              Christian News
            </Link>
            {primaryTag && (
              <>
                <span aria-hidden className="text-border">/</span>
                <Link
                  href={`${NAMESPACE_PATH}?tag=${encodeURIComponent(primaryTag)}`}
                  className="hover:text-primary transition-colors uppercase tracking-wider"
                >
                  {primaryTag}
                </Link>
              </>
            )}
          </nav>

          {/* Category label */}
          {primaryTag && (
            <span className="inline-flex text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground px-2 py-0.5 mb-3">
              {primaryTag}
            </span>
          )}

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance mb-4">
            {article.title}
          </h1>

          {/* Deck / excerpt */}
          {article.excerpt && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4 max-w-3xl">
              {article.excerpt}
            </p>
          )}

          {/* Byline row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 border-t border-border">
            {article.publishedAt && (
              <time dateTime={article.publishedAt} className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {formatDate(article.publishedAt)}
              </time>
            )}
            {article.tags.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.slice(1).map((tag) => (
                  <Link
                    key={tag}
                    href={`${NAMESPACE_PATH}?tag=${encodeURIComponent(tag)}`}
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border px-2 py-0.5 hover:border-primary hover:text-primary transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero image */}
      {heroUrl && (
        <div className="w-full bg-muted">
          <div className="max-w-5xl mx-auto">
            <div className="relative w-full aspect-[21/9]">
              <Image
                src={heroUrl}
                alt={article.thumbnail?.alt ?? article.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {article.richText && article.richText.length > 0 ? (
          <div className="prose prose-lg prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground max-w-none">
            <PortableText
              value={article.richText}
              carouselProductMap={carouselProductMap}
            />
          </div>
        ) : (
          <p className="text-muted-foreground">No content available for this article.</p>
        )}

        {/* Footer tag row */}
        {article.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-border">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Topics</p>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`${NAMESPACE_PATH}?tag=${encodeURIComponent(tag)}`}
                  className="text-[11px] font-bold uppercase tracking-wider text-foreground border border-border px-3 py-1 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to news */}
        <div className="mt-8">
          <Link
            href={NAMESPACE_PATH}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <span aria-hidden>&larr;</span>
            Back to Christian News
          </Link>
        </div>
      </div>
    </main>
  );
}
