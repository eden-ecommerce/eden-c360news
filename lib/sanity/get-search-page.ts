import "server-only";

import { fetchSanityDirect } from "@lib/sanity/direct-fetch";
import { cache } from "react";
import { z } from "zod";

/** Portable-text block shape (permissive — Sanity rich text). */
const portableTextBlock = z.object({ _type: z.string() }).passthrough();

const panelSchema = z.object({
  _key: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  eventIds: z.array(z.string()).optional(),
});

const searchPageSchema = z
  .object({
    title: z.string().optional(),
    description: z.array(portableTextBlock).optional(),
    panels: z.array(panelSchema).optional(),
  })
  .passthrough();

export type SearchPagePanel = {
  key: string;
  title: string;
  description: string | null;
  eventIds: string[];
};

export type SearchPageContent = {
  title: string | null;
  description: z.infer<typeof portableTextBlock>[] | null;
  panels: SearchPagePanel[];
};

/**
 * Fetches the organisationEventSearch page content from Sanity.
 * Sanity doc id: 97e4a372-709f-43cb-9d8e-bb7811b8b807
 */
const QUERY = `*[_type == "pages" && _id == "97e4a372-709f-43cb-9d8e-bb7811b8b807"][0]{
  title,
  description,
  panels[] {
    _key,
    title,
    description,
    "eventIds": events[]->_id
  }
}`;

export const getSearchPageContent = cache(async (): Promise<SearchPageContent | null> => {
  const result = await fetchSanityDirect(QUERY, undefined, ["organisationEventSearch"]);
  if (result.isErr()) return null;
  const parsed = searchPageSchema.safeParse(result.value);
  if (!parsed.success) return null;
  return {
    title: parsed.data.title ?? null,
    description: parsed.data.description ?? null,
    panels: (parsed.data.panels ?? []).map((p, i) => ({
      key: p._key ?? String(i),
      title: p.title ?? "Featured events",
      description: p.description ?? null,
      eventIds: p.eventIds ?? [],
    })),
  };
});
