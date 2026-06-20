import "server-only";

import { fetchSanityDirect } from "@lib/sanity/direct-fetch";
import { type ArticleCategory } from "@lib/sanity/get-articles";
import { cache } from "react";
import { z } from "zod";

// Fetch all distinct categories that appear on at least one published article.
const CATEGORIES_QUERY = `
  *[_type == "category" && count(*[_type == "article" && references(^._id) && defined(slug.current)]) > 0] {
    _id,
    title,
    slug
  } | order(title asc)
`;

const categorySchema = z
  .object({
    _id: z.string().optional(),
    title: z.string().optional(),
    slug: z.object({ current: z.string().optional() }).optional(),
  })
  .passthrough();

/** Fetch all article categories that have at least one published article. */
export const getArticleCategories = cache(async (): Promise<ArticleCategory[]> => {
  const result = await fetchSanityDirect(CATEGORIES_QUERY, undefined, ["article", "category"]);
  if (result.isErr()) return [];

  const parsed = z.array(categorySchema).safeParse(result.value);
  if (!parsed.success) return [];

  return parsed.data
    .map((raw) => ({
      id: raw._id ?? "",
      title: raw.title ?? "",
      slug: raw.slug?.current ?? "",
    }))
    .filter((c) => c.id && c.title && c.slug);
});
