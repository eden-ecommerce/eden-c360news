import { type Article } from "@lib/sanity/get-articles";
import { getSanityImage } from "@lib/sanity/image";
import { PortableText } from "@components/ui/PortableText";
import Link from "next/link";

type ArticleDetailPageProps = {
  article: Article;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  const imageProps = article.mainImage?.asset?._ref
    ? getSanityImage(article.mainImage, { width: 1200, height: 630 })
    : null;

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

      {/* Category labels */}
      {article.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {article.categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?category=${cat.slug}`}
              className="text-xs font-medium uppercase tracking-wider text-primary hover:underline"
            >
              {cat.title}
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
        {article.authorName && (
          <>
            <span aria-hidden>·</span>
            <span>{article.authorName}</span>
          </>
        )}
      </div>

      {/* Hero image */}
      {imageProps && (
        <figure className="mb-10 -mx-4 sm:-mx-6 overflow-hidden rounded-none sm:rounded-lg bg-muted">
          <img
            src={imageProps.url}
            alt={imageProps.alt || article.title}
            width={imageProps.width}
            height={imageProps.height}
            className="w-full object-cover max-h-[480px]"
            loading="eager"
          />
        </figure>
      )}

      {/* Excerpt lead */}
      {article.excerpt && (
        <p className="text-xl text-muted-foreground leading-relaxed mb-8 font-light">
          {article.excerpt}
        </p>
      )}

      {/* Body */}
      {article.body && article.body.length > 0 ? (
        <div className="prose prose-lg prose-headings:font-semibold prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground max-w-none">
          <PortableText value={article.body} />
        </div>
      ) : (
        <p className="text-muted-foreground">No content available for this article.</p>
      )}
    </main>
  );
}
