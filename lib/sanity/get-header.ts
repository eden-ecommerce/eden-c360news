import "server-only";

import { fetchSanityDirect } from "@lib/sanity/direct-fetch";
import { cache } from "react";
import { z } from "zod";

export type HeaderNavLink = {
  text: string;
  href: string;
};

export type Header = {
  title: string | null;
  phoneNumber: string | null;
  navigationLinks: HeaderNavLink[];
};

/** Shaped from GROQ exploration of *[_type == "header"][0] — extend after re-querying live CMS. */
const headerSchema = z
  .object({
    title: z.string().optional(),
    phoneNumber: z.string().optional(),
    navigationBar: z
      .object({
        panels: z
          .array(
            z.object({
              text: z.string().optional(),
              link: z
                .object({
                  linkValue: z.string().optional(),
                  url: z.string().optional(),
                })
                .optional(),
            }),
          )
          .optional(),
      })
      .optional(),
  })
  .passthrough();

const HEADER_QUERY = `*[_type == "header"][0]`;

const mapHeader = (data: z.infer<typeof headerSchema>): Header => {
  const navigationLinks = (data.navigationBar?.panels ?? [])
    .map((panel) => {
      const text = panel.text ?? "";
      const href = panel.link?.linkValue ?? panel.link?.url ?? "";
      return { text, href };
    })
    .filter((link) => link.text && link.href);

  return {
    title: data.title ?? null,
    phoneNumber: data.phoneNumber ?? null,
    navigationLinks,
  };
};

/** Cached Sanity header — GROQ fetch, validate, map in one lib file. */
export const getHeader = cache(async (): Promise<Header | null> => {
  const result = await fetchSanityDirect(HEADER_QUERY, undefined, ["header"]);
  if (result.isErr()) {
    return null;
  }

  const parsed = headerSchema.safeParse(result.value);
  if (!parsed.success) {
    return null;
  }

  return mapHeader(parsed.data);
});
