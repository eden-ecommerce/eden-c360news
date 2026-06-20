// TEMPORARILY DISABLED: real helpers come from the private
// `@christian-360/sanity` package, whose registry is currently unreachable
// from the v0 sandbox. To re-enable, restore the import below, add the
// dependency back to package.json, and delete the placeholder block.
//
// import {
//   getSanityImageDetails,
//   getWidthAndHeightFromImage,
//   type ImageWithAlt,
//   type ImageWithAltHotSpot,
// } from "@christian-360/sanity";

/* ---------------------------------------------------------------------------
 * REPLACE: placeholder stand-ins for `@christian-360/sanity`.
 * These mirror the real package's signatures so the template type-checks and
 * builds. Swap them for the real package once the registry is available.
 * ------------------------------------------------------------------------ */
export type ImageWithAlt = {
  _type?: string;
  asset?: { _ref?: string; _type?: string };
  alt?: string;
};

export type ImageWithAltHotSpot = ImageWithAlt & {
  hotspot?: { x: number; y: number; width: number; height: number };
};

type SanityImageDetailsOptions = {
  width: number;
  height?: number;
  dpr?: number;
};

type SanityImageDetails = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

/** Placeholder: builds a CDN-style URL from the provided options. */
function getSanityImageDetails(
  image: ImageWithAlt | ImageWithAltHotSpot | undefined,
  projectId: string,
  dataset: string,
  options: SanityImageDetailsOptions,
): SanityImageDetails {
  const width = options.width;
  const height = options.height ?? options.width;
  const dpr = options.dpr ?? 1;
  const ref = image?.asset?._ref ?? "placeholder";
  const url = `https://cdn.sanity.io/images/${projectId || "REPLACE_PROJECT_ID"}/${
    dataset || "REPLACE_DATASET"
  }/${ref}?w=${width}&h=${height}&dpr=${dpr}`;

  return {
    url,
    alt: image?.alt ?? "",
    width,
    height,
  };
}

/** Placeholder: returns the intrinsic dimensions of a Sanity image. */
function getWidthAndHeightFromImage(_image: ImageWithAlt | ImageWithAltHotSpot): {
  width: number;
  height: number;
} {
  // REPLACE: real implementation parses dimensions from the asset `_ref`.
  return { width: 1, height: 1 };
}

export type ImageDprs = {
  1: number;
  2: number;
};

export const getSanityImage = (
  image: Parameters<typeof getSanityImageDetails>[0],
  options: Parameters<typeof getSanityImageDetails>[3],
) => {
  return getSanityImageDetails(
    image,
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
    process.env.NEXT_PUBLIC_SANITY_DATASET ?? "",
    options,
  );
};

export const buildSanityImageProps = (
  image: Parameters<typeof getSanityImageDetails>[0],
  options: {
    width: number;
    height?: number;
    dpr1x?: number;
    dpr2x?: number;
  },
): {
  src: string;
  srcSet: string;
  alt: string;
  width: number;
  height: number;
} => {
  const oneX = getSanityImage(image, {
    width: options.width,
    height: options.height,
    dpr: options.dpr1x,
  });
  const twoX = getSanityImage(image, {
    width: options.width,
    height: options.height,
    dpr: options.dpr2x,
  });

  return {
    src: oneX.url,
    srcSet: `${oneX.url} 1x, ${twoX.url} 2x`,
    alt: oneX.alt ?? "",
    width: oneX.width,
    height: oneX.height,
  };
};

export const getOptimisedArticleImageWidth = (
  baseWidth: number,
  image?: ImageWithAltHotSpot | ImageWithAlt,
) => {
  if (!image) {
    return baseWidth;
  }

  const imageDimensions = getWidthAndHeightFromImage(image);
  const imageAspectRatio = imageDimensions.width / imageDimensions.height;
  const newImageWidth = Math.round(baseWidth * imageAspectRatio);

  return newImageWidth > imageDimensions.width
    ? imageDimensions.width
    : newImageWidth;
};
