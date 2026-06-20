import imageUrlBuilder from "@sanity/image-url";
import { type SanityImageSource } from "@sanity/image-url/lib/types/types";

/**
 * Convert a Sanity image reference (asset._ref) to a CDN URL.
 * The builder is constructed lazily inside the function so that
 * EDEN_SANITY_PROJECT_ID is read at call time (request time) rather than
 * at module-initialisation time (build time), which would produce empty
 * project IDs and broken URLs on statically rendered pages.
 */
export function sanityImageUrl(
  source: SanityImageSource | null | undefined,
  opts?: { width?: number; height?: number; fit?: "max" | "crop" | "clip" | "fill" },
): string | null {
  if (!source) return null;
  const projectId = process.env.EDEN_SANITY_PROJECT_ID ?? "";
  const dataset = process.env.EDEN_SANITY_DATASET ?? "eden";
  if (!projectId) return null;
  try {
    const builder = imageUrlBuilder({ projectId, dataset });
    let img = builder.image(source);
    if (opts?.width) img = img.width(opts.width);
    if (opts?.height) img = img.height(opts.height);
    if (opts?.fit) img = img.fit(opts.fit);
    return img.auto("format").url();
  } catch {
    return null;
  }
}
