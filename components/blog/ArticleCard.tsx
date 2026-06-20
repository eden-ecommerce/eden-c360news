import { type Article } from "@lib/sanity/get-articles";
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
  const primaryTag = article.tags[0] ?? null;

  return (
    <article className="group flex flex-col bg-card border border-border rounded-lg overflow-hidden transition-shadow hover:shadow-md">
      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Tag badge */}
        {primaryTag && (
          <span className="text-xs font-medium uppercase tracking-wider text-primary">
            {primaryTag}
          </span>
        )}

        {/* Title */}
        <h2 className="text-base font-semibold leading-snug text-foreground text-balance">
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
            className="text-xs text-muted-foreground mt-auto pt-3 border-t border-border block"
          >
            {formatDate(article.publishedAt)}
          </time>
        )}
      </div>
    </article>
  );
}
