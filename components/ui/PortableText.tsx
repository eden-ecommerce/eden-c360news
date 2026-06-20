"use client";

import {
  PortableText as BasePortableText,
  type PortableTextComponents,
  type PortableTextProps,
} from "@portabletext/react";
import Image from "next/image";
import { sanityImageUrl } from "@lib/sanity/image-url";

// ---------------------------------------------------------------------------
// edenXtImage — inline image with a plain URL (legacy format)
// ---------------------------------------------------------------------------
function EdenXtImage({ value }: { value: { url?: string; alt?: string; fullWidth?: boolean; floatLeft?: boolean } }) {
  if (!value.url) return null;
  // Relative URLs from eden.co.uk
  const src = value.url.startsWith("/")
    ? `https://www.eden.co.uk${value.url}`
    : value.url;
  return (
    <figure className={`my-6 ${value.floatLeft ? "float-left mr-6 mb-2 max-w-xs" : value.fullWidth ? "w-full" : "mx-auto max-w-lg"}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={value.alt ?? ""} className="rounded-md w-full h-auto" loading="lazy" />
    </figure>
  );
}

// ---------------------------------------------------------------------------
// articleImage — Sanity asset reference image (newer format)
// ---------------------------------------------------------------------------
function ArticleImage({ value }: { value: { image?: { asset?: { _ref?: string }; alt?: string }; float?: string } }) {
  const ref = value.image?.asset?._ref;
  if (!ref) return null;
  const url = sanityImageUrl({ _type: "reference", _ref: ref }, { width: 900, fit: "max" });
  if (!url) return null;
  const isFloat = value.float === "left" || value.float === "right";
  return (
    <figure
      className={`my-6 ${
        value.float === "left"
          ? "float-left mr-6 mb-2 max-w-xs clear-left"
          : value.float === "right"
          ? "float-right ml-6 mb-2 max-w-xs clear-right"
          : "mx-auto max-w-2xl"
      }`}
    >
      <Image
        src={url}
        alt={value.image?.alt ?? ""}
        width={isFloat ? 320 : 900}
        height={isFloat ? 240 : 600}
        className="rounded-md w-full h-auto"
      />
    </figure>
  );
}

// ---------------------------------------------------------------------------
// edenXtVideo — YouTube / external embed URL
// ---------------------------------------------------------------------------
function EdenXtVideo({ value }: { value: { url?: string } }) {
  if (!value.url) return null;
  return (
    <figure className="my-8 aspect-video w-full overflow-hidden rounded-xl shadow-md">
      <iframe
        src={value.url}
        title="Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
    </figure>
  );
}

// ---------------------------------------------------------------------------
// video — Sanity-hosted MP4 file
// ---------------------------------------------------------------------------
function SanityVideo({ value }: { value: { videoLink?: string; title?: string } }) {
  if (!value.videoLink) return null;
  return (
    <figure className="my-8">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src={value.videoLink}
        controls
        className="w-full rounded-xl shadow-md"
        title={value.title ?? "Video"}
      />
      {value.title && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2">{value.title}</figcaption>
      )}
    </figure>
  );
}

// ---------------------------------------------------------------------------
// featuredProduct — single product callout card
// ---------------------------------------------------------------------------
function FeaturedProduct({ value }: { value: { title?: string; backgroundColour?: string; productNameColour?: string; showAddToBasket?: boolean; product?: { productIds?: number[]; productIsbn?: string[] } } }) {
  const isbns = value.product?.productIsbn ?? [];
  const firstIsbn = isbns[0];
  if (!value.title && !firstIsbn) return null;
  const productUrl = firstIsbn ? `https://www.eden.co.uk/product/${firstIsbn}/` : null;
  return (
    <aside
      className="my-8 rounded-xl p-6 border border-border"
      style={value.backgroundColour ? { backgroundColor: value.backgroundColour } : undefined}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Featured product</p>
      <p
        className="font-semibold text-lg leading-snug"
        style={value.productNameColour ? { color: value.productNameColour } : undefined}
      >
        {value.title}
      </p>
      {productUrl && value.showAddToBasket && (
        <a
          href={productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-md bg-primary text-primary-foreground text-sm font-medium px-4 py-2 hover:opacity-90 transition-opacity"
        >
          View on Eden
        </a>
      )}
    </aside>
  );
}

// ---------------------------------------------------------------------------
// carouselV2 — product carousel shown as a simple pill list
// ---------------------------------------------------------------------------
function CarouselV2({ value }: { value: { products?: { productIsbn?: string[] }; title?: string } }) {
  const isbns = value.products?.productIsbn ?? [];
  if (isbns.length === 0) return null;
  return (
    <aside className="my-8 rounded-xl border border-border p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {value.title ?? "Related products"}
      </p>
      <div className="flex flex-wrap gap-2">
        {isbns.map((isbn) => (
          <a
            key={isbn}
            href={`https://www.eden.co.uk/product/${isbn}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary border border-primary rounded-full px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {isbn}
          </a>
        ))}
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Assembled component map
// ---------------------------------------------------------------------------
const defaultComponents: PortableTextComponents = {
  types: {
    edenXtImage:  ({ value }) => <EdenXtImage value={value} />,
    articleImage: ({ value }) => <ArticleImage value={value} />,
    edenXtVideo:  ({ value }) => <EdenXtVideo value={value} />,
    video:        ({ value }) => <SanityVideo value={value} />,
    featuredProduct: ({ value }) => <FeaturedProduct value={value} />,
    carouselV2:   ({ value }) => <CarouselV2 value={value} />,
    // Other commerce/layout block types that appear in richText but aren't
    // meaningful in an editorial article context — render nothing.
    hub:          () => null,
    imageGridV2:  () => null,
    circleIconGrid: () => null,
    featuredSectionCheckMarkCircledImage: () => null,
    textHeadingV2: () => null,
    buttonGrid:   () => null,
    slidePanel:   () => null,
    testimonials: () => null,
    masonry:      () => null,
    pageHeader:   () => null,
    grid:         () => null,
    productCarousel: () => null,
    richText:     () => null,
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em:     ({ children }) => <em className="italic">{children}</em>,
  },
  block: {
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-semibold mt-5 mb-2">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 my-4 space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 my-4 space-y-1">{children}</ol>,
  },
};

/** Portable text renderer with Eden-specific custom block components. */
export function PortableText({ components, ...props }: PortableTextProps) {
  return (
    <BasePortableText
      components={{ ...defaultComponents, ...components }}
      {...props}
    />
  );
}
