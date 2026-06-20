import "server-only";

import { fetchSanityDirect } from "@lib/sanity/direct-fetch";
import { cache } from "react";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Zod schema — reflects the confirmed live article schema.
// Fields discovered via exploratory GROQ: _id, title, slug.current,
// richText, datePublished, metaDescription, pageTitle, tags (string[]),
// authors (reference array).
// ---------------------------------------------------------------------------

const portableTextBlockSchema = z.record(z.unknown());

const articleSchema = z.object({
  _id: z.string().nullish(),
  _updatedAt: z.string().nullish(),
  title: z.string().nullish(),
  pageTitle: z.string().nullish(),
  slug: z.object({ current: z.string().nullish() }).nullish(),
  metaDescription: z.string().nullish(),
  datePublished: z.string().nullish(),
  tags: z.array(z.string()).nullish(),
  richText: z.array(portableTextBlockSchema).nullish(),
});

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  richText: any[] | null;
  publishedAt: string | null;
  tags: string[];
};

// ---------------------------------------------------------------------------
// Mapper
// ---------------------------------------------------------------------------

const mapArticle = (raw: z.infer<typeof articleSchema>): Article => ({
  id: raw._id ?? "",
  title: raw.title ?? "",
  slug: raw.slug?.current ?? "",
  excerpt: raw.metaDescription ?? null,
  richText: raw.richText ?? null,
  publishedAt: raw.datePublished ?? null,
  tags: raw.tags ?? [],  // nullish coalesces both null and undefined to []
});

// ---------------------------------------------------------------------------
// GROQ queries
// ---------------------------------------------------------------------------

const ARTICLE_FIELDS = `
  _id,
  _updatedAt,
  title,
  pageTitle,
  slug,
  metaDescription,
  datePublished,
  tags
`;

// Fetch listing data (no richText — keep payload small)
const ARTICLES_QUERY = `*[_type == "article" && defined(slug.current)] | order(datePublished desc) [0..99] {
  ${ARTICLE_FIELDS}
}`;

// Fetch single article with full richText body
const ARTICLE_BY_SLUG_QUERY = `*[_type == "article" && slug.current == $slug][0] {
  ${ARTICLE_FIELDS},
  richText[]
}`;

const ALL_SLUGS_QUERY = `*[_type == "article" && defined(slug.current)]{ "slug": slug.current }`;

// ---------------------------------------------------------------------------
// Public API — all cache()-wrapped per the established pattern
// ---------------------------------------------------------------------------

/** Fetch articles for the listing page, optionally filtered by a tag. */
export const getArticles = cache(async (): Promise<Article[]> => {
  const result = await fetchSanityDirect(ARTICLES_QUERY, undefined, ["article"]);
  if (result.isErr()) return [];

  const parsed = z.array(articleSchema).safeParse(result.value);
  if (!parsed.success) {
    console.log("[v0] getArticles Zod error:", JSON.stringify(parsed.error.issues.slice(0, 3)));
    return [];
  }

  return parsed.data.map(mapArticle).filter((a) => a.slug);
});

/** Fetch a single article by its slug. */
export const getArticleBySlug = cache(
  async (slug: string): Promise<Article | null> => {
    const result = await fetchSanityDirect(
      ARTICLE_BY_SLUG_QUERY,
      { slug },
      ["article", `article:${slug}`],
    );

    if (result.isErr()) return null;
    if (!result.value) return null;

    const parsed = articleSchema.safeParse(result.value);
    if (!parsed.success) return null;

    return mapArticle(parsed.data);
  },
);

/** Fetch all article slugs for generateStaticParams. */
export const getAllArticleSlugs = cache(async (): Promise<string[]> => {
  const result = await fetchSanityDirect(ALL_SLUGS_QUERY, undefined, ["article"]);
  if (result.isErr()) return [];

  const parsed = z.array(z.object({ slug: z.string() })).safeParse(result.value);
  if (!parsed.success) return [];

  return parsed.data.map((r) => r.slug).filter(Boolean);
});
