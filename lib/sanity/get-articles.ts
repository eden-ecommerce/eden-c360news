import "server-only";

import { fetchSanityDirect } from "@lib/sanity/direct-fetch";
import { sanityImageUrl } from "@lib/sanity/image-url";
import { cache } from "react";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Schema — confirmed against live Sanity data.
// slug is projected as a plain string via "slug": slug.current in GROQ.
// tags is string[] or null. datePublished is ISO string or null.
// ---------------------------------------------------------------------------

const portableTextBlockSchema = z.record(z.unknown());

const sanityImageAssetSchema = z.object({
  _ref: z.string(),
  _type: z.literal("reference"),
});

const thumbnailSchema = z.object({
  _type: z.string(),
  alt: z.string().nullish(),
  asset: sanityImageAssetSchema.nullish(),
}).nullish();

const articleSchema = z.object({
  _id: z.string().nullish(),
  title: z.string().nullish(),
  slug: z.string().nullish(),
  metaDescription: z.string().nullish(),
  datePublished: z.string().nullish(),
  tags: z.array(z.string()).nullish(),
  thumbnail: thumbnailSchema,
  richText: z.array(portableTextBlockSchema).nullish(),
});

// ---------------------------------------------------------------------------
// Domain type
// ---------------------------------------------------------------------------

export type ArticleThumbnail = {
  assetRef: string;
  alt: string;
} | null;

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail: ArticleThumbnail;
  /** Fully resolved CDN URL — safe to use directly in client components. */
  thumbnailUrl: string | null;
  thumbnailUrlHero: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  richText: any[] | null;
  publishedAt: string | null;
  tags: string[];
};

// ---------------------------------------------------------------------------
// Mapper
// ---------------------------------------------------------------------------

const mapArticle = (raw: z.infer<typeof articleSchema>): Article => {
  const assetRef = raw.thumbnail?.asset?._ref ?? null;
  const imageSource = assetRef ? { _type: "reference" as const, _ref: assetRef } : null;
  return {
    id: raw._id ?? "",
    title: raw.title ?? "",
    slug: raw.slug ?? "",
    excerpt: raw.metaDescription ?? null,
    thumbnail: assetRef
      ? { assetRef, alt: raw.thumbnail?.alt ?? "" }
      : null,
    // Resolve CDN URLs here (server-only context) so client components never
    // need to read EDEN_SANITY_PROJECT_ID from process.env.
    thumbnailUrl: sanityImageUrl(imageSource, { width: 600, height: 400, fit: "crop" }),
    thumbnailUrlHero: sanityImageUrl(imageSource, { width: 1200, height: 630, fit: "crop" }),
    richText: raw.richText ?? null,
    publishedAt: raw.datePublished ?? null,
    tags: raw.tags ?? [],
  };
};

// ---------------------------------------------------------------------------
// GROQ queries
// Use "slug": slug.current to project the slug string directly.
// ---------------------------------------------------------------------------

const ARTICLE_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  metaDescription,
  datePublished,
  tags,
  thumbnail{ _type, alt, asset }
`;

// "Christian360News" in tags scopes all queries to the christian-news namespace.
// datePublished <= now() ensures only past (published) articles are returned.
const PUBLISHED_FILTER = `_type == "article" && defined(slug.current) && datePublished <= now() && "Christian360News" in tags`;

const ARTICLES_QUERY = `*[${PUBLISHED_FILTER}] | order(datePublished desc) [0..99] {
  ${ARTICLE_FIELDS}
}`;

const ARTICLES_BY_TAG_QUERY = `*[${PUBLISHED_FILTER} && $tag in tags] | order(datePublished desc) [0..99] {
  ${ARTICLE_FIELDS}
}`;

const ARTICLE_BY_SLUG_QUERY = `*[_type == "article" && slug.current == $slug && datePublished <= now() && "Christian360News" in tags][0] {
  ${ARTICLE_FIELDS},
  richText[]
}`;

const ALL_SLUGS_QUERY = `*[${PUBLISHED_FILTER}]{ "slug": slug.current }`;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const getArticles = cache(async (): Promise<Article[]> => {
  const result = await fetchSanityDirect(ARTICLES_QUERY, undefined, ["article"]);
  if (result.isErr()) return [];

  const parsed = z.array(articleSchema).safeParse(result.value);
  if (!parsed.success) return [];

  return parsed.data.map(mapArticle).filter((a) => a.slug);
});

export const getArticlesByTag = cache(async (tag: string): Promise<Article[]> => {
  const result = await fetchSanityDirect(
    ARTICLES_BY_TAG_QUERY,
    { tag },
    ["article"],
  );
  if (result.isErr()) return [];

  const parsed = z.array(articleSchema).safeParse(result.value);
  if (!parsed.success) return [];

  return parsed.data.map(mapArticle).filter((a) => a.slug);
});

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

export const getAllArticleSlugs = cache(async (): Promise<string[]> => {
  const result = await fetchSanityDirect(ALL_SLUGS_QUERY, undefined, ["article"]);
  if (result.isErr()) return [];

  const parsed = z.array(z.object({ slug: z.string() })).safeParse(result.value);
  if (!parsed.success) return [];

  return parsed.data.map((r) => r.slug).filter(Boolean);
});
