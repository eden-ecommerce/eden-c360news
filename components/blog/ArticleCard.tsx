import { type Article } from "@lib/sanity/get-articles";
import Image from "next/image";
import Link from "next/link";
import { NAMESPACE_PATH } from "@lib/config";

type ArticleCardProps = {
  article: Article;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ArticleCard({ article }: ArticleCardProps) {
  const href = `${NAMESPACE_PATH}/${article.slug}`;
  const primaryTag = article.tags[0] ?? null;
  const thumbnailUrl = article.thumbnailUrl;

  return (
    <article className="group flex flex-col bg-card border border-border overflow-hidden transition-shadow hover:shadow-md">
      {/* Thumbnail */}
      {thumbnailUrl && (
        <Link href={href} tabIndex={-1} aria-hidden>
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
            <Image
              src={thumbnailUrl}
              alt={article.thumbnail?.alt ?? article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category pill */}
        {primaryTag && (
          <span className="inline-flex self-start text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground px-2 py-0.5">
            {primaryTag}
          </span>
        )}

        {/* Title */}
        <h2 className="text-sm font-bold leading-snug text-foreground text-balance">
          <Link href={href} className="hover:text-primary transition-colors">
            {article.title}
          </Link>
        </h2>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
            {article.excerpt}
          </p>
        )}

        {/* Date */}
        {article.publishedAt && (
          <time
            dateTime={article.publishedAt}
            className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-auto pt-2 border-t border-border block"
          >
            {formatDate(article.publishedAt)}
          </time>
        )}
      </div>
    </article>
  );
}
