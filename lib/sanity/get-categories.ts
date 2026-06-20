import "server-only";

import { fetchSanityDirect } from "@lib/sanity/direct-fetch";
import { cache } from "react";
import { z } from "zod";

// Tags are plain strings on each article — no separate category document type.
// We fetch all distinct tag values across published articles and sort them.
const TAGS_QUERY = `
  array::unique(*[_type == "article" && defined(tags)].tags[])
`;

/** Fetch all distinct tags used across articles, sorted alphabetically. */
export const getArticleTags = cache(async (): Promise<string[]> => {
  const result = await fetchSanityDirect(TAGS_QUERY, undefined, ["article"]);
  if (result.isErr()) return [];

  const parsed = z.array(z.string()).safeParse(result.value);
  if (!parsed.success) return [];

  return parsed.data.filter(Boolean).sort((a, b) => a.localeCompare(b));
});
