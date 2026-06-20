import React from "react";
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
  const href = article.id ? `${NAMESPACE_PATH}/${article.id}` : null;
  const primaryTag = article.tags[0] ?? null;
  const thumbnailUrl = article.thumbnailUrl;

  const ImageWrapper = href
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={href} tabIndex={-1} aria-hidden>{children}</Link>
      )
    : ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

  return (
    <article className="group flex flex-col bg-card border border-border overflow-hidden transition-shadow hover:shadow-md h-full">
      {/* Thumbnail — always rendered to keep cards uniform height */}
      <ImageWrapper>
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={article.thumbnail?.alt ?? article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            /* Placeholder when no image is available */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/10 gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-primary/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4-4 4 4 4-6 4 6M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
              </svg>
              <span className="text-[10px] uppercase tracking-widest text-primary/40 font-bold">Christian News</span>
            </div>
          )}
        </div>
      </ImageWrapper>

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
          {href ? (
            <Link href={href} className="hover:text-primary transition-colors">
              {article.title}
            </Link>
          ) : (
            article.title
          )}
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
