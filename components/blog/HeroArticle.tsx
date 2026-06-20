import { type Article } from "@lib/sanity/get-articles";
import Image from "next/image";
import Link from "next/link";
import { NAMESPACE_PATH } from "@lib/config";

type HeroArticleProps = {
  article: Article;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function HeroArticle({ article }: HeroArticleProps) {
  const href = article.slug ? `${NAMESPACE_PATH}/${article.slug}` : null;
  const primaryTag = article.tags[0] ?? null;

  return (
    <article className="group relative w-full overflow-hidden bg-foreground" aria-label="Featured story">
      {/* Background image */}
      <div className="relative w-full aspect-[21/9] min-h-[320px] md:min-h-[420px]">
        {article.thumbnailUrl ? (
          <Image
            src={article.thumbnailUrl}
            alt={article.thumbnail?.alt ?? article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-102 brightness-75"
          />
        ) : (
          <div className="absolute inset-0 bg-foreground" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
          {primaryTag && (
            <span className="inline-flex text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground px-2 py-0.5 mb-3">
              {primaryTag}
            </span>
          )}

          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance max-w-3xl">
            {href ? (
              <Link href={href} className="hover:text-primary/90 transition-colors">
                {article.title}
              </Link>
            ) : (
              article.title
            )}
          </h2>

          {article.excerpt && (
            <p className="mt-3 text-sm md:text-base text-white/80 leading-relaxed max-w-2xl line-clamp-2 md:line-clamp-3">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 mt-4">
            {article.publishedAt && (
              <time dateTime={article.publishedAt} className="text-xs text-white/60 uppercase tracking-wider font-medium">
                {formatDate(article.publishedAt)}
              </time>
            )}
            {href && (
              <Link
                href={href}
                className="text-xs font-bold uppercase tracking-wider text-white border border-white/50 px-4 py-1.5 hover:bg-white hover:text-foreground transition-colors"
              >
                Read Story
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
