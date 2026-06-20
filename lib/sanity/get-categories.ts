import "server-only";

import { fetchSanityDirect } from "@lib/sanity/direct-fetch";
import { cache } from "react";
import { z } from "zod";

// Fetch the 40 most-used tags across articles, ordered by frequency descending.
const TAGS_QUERY = `
  *[_type == "article" && defined(tags)] {
    tags[]
  }
`;

/** Fetch the top 40 most-used tags across articles, sorted by frequency. */
export const getArticleTags = cache(async (): Promise<string[]> => {
  const result = await fetchSanityDirect(TAGS_QUERY, undefined, ["article"]);
  if (result.isErr()) return [];

  const parsed = z.array(z.object({ tags: z.array(z.string()).nullish() })).safeParse(result.value);
  if (!parsed.success) return [];

  // Count frequency of each tag
  const freq: Record<string, number> = {};
  for (const doc of parsed.data) {
    for (const tag of doc.tags ?? []) {
      if (tag) freq[tag] = (freq[tag] ?? 0) + 1;
    }
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([tag]) => tag);
});
