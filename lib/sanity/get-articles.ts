import "server-only";

import { fetchSanityDirect } from "@lib/sanity/direct-fetch";
import { type ImageWithAlt } from "@lib/sanity/image";
import { cache } from "react";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Zod schema — all fields are optional for resilience against schema changes.
// The GROQ query uses an exploratory approach; tighten once the live schema is
// confirmed via the Sanity Studio.
// ---------------------------------------------------------------------------

const categoryRefSchema = z
  .object({
    _id: z.string().optional(),
    title: z.string().optional(),
    slug: z
      .object({ current: z.string().optional() })
      .optional(),
  })
  .passthrough();

const slugSchema = z.object({ current: z.string().optional() }).passthrough();

const imageAssetSchema = z
  .object({
    _ref: z.string().optional(),
    _type: z.string().optional(),
  })
  .passthrough();

const imageSchema = z
  .object({
    asset: imageAssetSchema.optional(),
    alt: z.string().optional(),
    hotspot: z
      .object({ x: z.number(), y: z.number(), width: z.number(), height: z.number() })
      .optional(),
  })
  .passthrough();

const portableTextBlockSchema = z.record(z.unknown()).passthrough();

const articleSchema = z
  .object({
    _id: z.string().optional(),
    _type: z.string().optional(),
    _updatedAt: z.string().optional(),
    title: z.string().optional(),
    slug: slugSchema.optional(),
    excerpt: z.string().optional(),
    body: z.array(portableTextBlockSchema).optional(),
    mainImage: imageSchema.optional(),
    publishedAt: z.string().optional(),
    categories: z.array(categoryRefSchema).optional(),
    author: z
      .object({
        name: z.string().optional(),
        image: imageSchema.optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

export type ArticleCategory = {
  id: string;
  title: string;
  slug: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[] | null;
  mainImage: ImageWithAlt | null;
  publishedAt: string | null;
  categories: ArticleCategory[];
  authorName: string | null;
};

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

const mapCategory = (raw: z.infer<typeof categoryRefSchema>): ArticleCategory => ({
  id: raw._id ?? "",
  title: raw.title ?? "",
  slug: raw.slug?.current ?? "",
});

const mapArticle = (raw: z.infer<typeof articleSchema>): Article => ({
  id: raw._id ?? "",
  title: raw.title ?? "",
  slug: raw.slug?.current ?? "",
  excerpt: raw.excerpt ?? null,
  body: raw.body ?? null,
  mainImage: raw.mainImage
    ? {
        asset: raw.mainImage.asset
          ? { _ref: raw.mainImage.asset._ref, _type: raw.mainImage.asset._type }
          : undefined,
        alt: raw.mainImage.alt,
      }
    : null,
  publishedAt: raw.publishedAt ?? null,
  categories: (raw.categories ?? []).map(mapCategory),
  authorName: raw.author?.name ?? null,
});

// ---------------------------------------------------------------------------
// GROQ queries
// ---------------------------------------------------------------------------

const ARTICLE_FIELDS = `
  _id,
  _type,
  _updatedAt,
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage { asset, alt, hotspot },
  categories[]->{ _id, title, slug },
  author->{ name, image { asset, alt } }
`;

const ARTICLES_QUERY = `*[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
  ${ARTICLE_FIELDS}
}`;

const ARTICLES_BY_CATEGORY_QUERY = `*[_type == "article" && defined(slug.current) && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
  ${ARTICLE_FIELDS}
}`;

const ARTICLE_BY_SLUG_QUERY = `*[_type == "article" && slug.current == $slug][0] {
  ${ARTICLE_FIELDS},
  body[]
}`;

const ALL_SLUGS_QUERY = `*[_type == "article" && defined(slug.current)]{ "slug": slug.current }`;

// ---------------------------------------------------------------------------
// Public API — all cache()-wrapped per the established pattern
// ---------------------------------------------------------------------------

/** Fetch all articles, optionally filtered to a category slug. */
export const getArticles = cache(
  async (categorySlug?: string): Promise<Article[]> => {
    const query = categorySlug ? ARTICLES_BY_CATEGORY_QUERY : ARTICLES_QUERY;
    const params = categorySlug ? { categorySlug } : undefined;
    const result = await fetchSanityDirect(query, params, ["article"]);

    if (result.isErr()) return [];

    const parsed = z.array(articleSchema).safeParse(result.value);
    if (!parsed.success) return [];

    return parsed.data.map(mapArticle);
  },
);

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

  const parsed = z
    .array(z.object({ slug: z.string() }).passthrough())
    .safeParse(result.value);
  if (!parsed.success) return [];

  return parsed.data.map((r) => r.slug).filter(Boolean);
});
