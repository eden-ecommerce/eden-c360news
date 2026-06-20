import imageUrlBuilder from "@sanity/image-url";
import { type SanityImageSource } from "@sanity/image-url/lib/types/types";

const projectId = process.env.EDEN_SANITY_PROJECT_ID ?? "";
const dataset   = process.env.EDEN_SANITY_DATASET ?? "eden";

const builder = imageUrlBuilder({ projectId, dataset });

/**
 * Convert a Sanity image reference (asset._ref) to a CDN URL.
 * Returns null when the source is empty or missing.
 */
export function sanityImageUrl(
  source: SanityImageSource | null | undefined,
  opts?: { width?: number; height?: number; fit?: "max" | "crop" | "clip" | "fill" },
): string | null {
  if (!source) return null;
  try {
    let img = builder.image(source);
    if (opts?.width)  img = img.width(opts.width);
    if (opts?.height) img = img.height(opts.height);
    if (opts?.fit)    img = img.fit(opts.fit);
    return img.auto("format").url();
  } catch {
    return null;
  }
}
