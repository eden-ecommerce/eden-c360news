import { type Article } from "@lib/sanity/get-articles";
import { getSanityImage } from "@lib/sanity/image";
import Link from "next/link";

type ArticleCardProps = {
  article: Article;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ArticleCard({ article }: ArticleCardProps) {
  const href = `/blog/${article.slug}`;

  const imageProps = article.mainImage?.asset?._ref
    ? getSanityImage(article.mainImage, { width: 720, height: 480 })
    : null;

  const primaryCategory = article.categories[0] ?? null;

  return (
    <article className="group flex flex-col bg-card border border-border rounded-lg overflow-hidden transition-shadow hover:shadow-md">
      {/* Image */}
      <Link href={href} aria-hidden tabIndex={-1} className="block overflow-hidden aspect-video bg-muted">
        {imageProps ? (
          <img
            src={imageProps.url}
            alt={imageProps.alt || article.title}
            width={imageProps.width}
            height={imageProps.height}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Category badge */}
        {primaryCategory && (
          <span className="text-xs font-medium uppercase tracking-wider text-primary">
            {primaryCategory.title}
          </span>
        )}

        {/* Title */}
        <h2 className="text-lg font-semibold leading-snug text-foreground text-balance">
          <Link href={href} className="hover:text-primary transition-colors">
            {article.title}
          </Link>
        </h2>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {article.excerpt}
          </p>
        )}

        {/* Footer: date */}
        {article.publishedAt && (
          <time
            dateTime={article.publishedAt}
            className="text-xs text-muted-foreground mt-auto pt-2 border-t border-border"
          >
            {formatDate(article.publishedAt)}
          </time>
        )}
      </div>
    </article>
  );
}
