"use client";

import {
  PortableText as BasePortableText,
  type PortableTextComponents,
  type PortableTextProps,
} from "@portabletext/react";
import Image from "next/image";
import { sanityImageUrl } from "@lib/sanity/image-url";
import type { AlgoliaProductHit } from "@lib/algolia/fetch-products-by-isbn";
import { ProductCard } from "@components/blog/ProductCard";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
type EdenLink = { linkType?: string; linkValue?: string };

function edenHref(link?: EdenLink): string | null {
  if (!link?.linkValue) return null;
  return link.linkValue.startsWith("http")
    ? link.linkValue
    : `https://www.eden.co.uk${link.linkValue}`;
}

// ---------------------------------------------------------------------------
// edenXtImage — inline image with a plain URL (legacy format)
// ---------------------------------------------------------------------------
function EdenXtImage({
  value,
}: {
  value: { url?: string; alt?: string; fullWidth?: boolean; floatLeft?: boolean };
}) {
  if (!value.url) return null;
  const src = value.url.startsWith("/")
    ? `https://www.eden.co.uk${value.url}`
    : value.url;
  return (
    <figure
      className={`my-6 ${value.floatLeft ? "float-left mr-6 mb-2 max-w-xs" : value.fullWidth ? "w-full" : "mx-auto max-w-lg"}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={value.alt ?? ""}
        className="rounded-md w-full h-auto"
        loading="lazy"
      />
    </figure>
  );
}

// ---------------------------------------------------------------------------
// articleImage — Sanity asset reference image
// ---------------------------------------------------------------------------
function ArticleImage({
  value,
}: {
  value: { image?: { asset?: { _ref?: string }; alt?: string }; float?: string };
}) {
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
function SanityVideo({
  value,
}: {
  value: { videoLink?: string; title?: string };
}) {
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
        <figcaption className="text-center text-sm text-muted-foreground mt-2">
          {value.title}
        </figcaption>
      )}
    </figure>
  );
}

// ---------------------------------------------------------------------------
// featuredProduct — single product callout card
// ---------------------------------------------------------------------------
function FeaturedProduct({
  value,
}: {
  value: {
    title?: string;
    backgroundColour?: string;
    productNameColour?: string;
    showAddToBasket?: boolean;
    product?: { productIds?: number[]; productIsbn?: string[] };
  };
}) {
  const isbns = value.product?.productIsbn ?? [];
  const firstIsbn = isbns[0];
  const productUrl = firstIsbn
    ? `https://www.eden.co.uk/product/${firstIsbn}/`
    : null;

  return (
    <aside
      className="my-8 rounded-xl p-6 border border-border"
      style={value.backgroundColour ? { backgroundColor: value.backgroundColour } : undefined}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        Featured product
      </p>
      {value.title && (
        <p
          className="font-semibold text-lg leading-snug"
          style={value.productNameColour ? { color: value.productNameColour } : undefined}
        >
          {value.title}
        </p>
      )}
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
// textHeadingV2 — coloured section heading
// ---------------------------------------------------------------------------
function TextHeadingV2({
  value,
}: {
  value: { heading?: string; headingColour?: string };
}) {
  if (!value.heading) return null;
  return (
    <h2
      className="text-xl font-bold mt-8 mb-4"
      style={value.headingColour ? { color: value.headingColour } : undefined}
    >
      {value.heading}
    </h2>
  );
}

// ---------------------------------------------------------------------------
// buttonGrid — grid of internal/external link buttons
// ---------------------------------------------------------------------------
function ButtonGrid({
  value,
}: {
  value: {
    buttons?: {
      _key: string;
      text?: string;
      link?: EdenLink;
    }[];
    buttonColour?: string;
  };
}) {
  const buttons = value.buttons ?? [];
  if (buttons.length === 0) return null;
  return (
    <div className="my-6 flex flex-wrap gap-2">
      {buttons.map((btn) => {
        const href = edenHref(btn.link);
        const isExternal = href?.startsWith("http");
        return href ? (
          <a
            key={btn._key}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="inline-block rounded-full px-4 py-2 text-sm font-medium text-foreground border border-border hover:border-primary hover:text-primary transition-colors"
            style={value.buttonColour ? { backgroundColor: value.buttonColour } : undefined}
          >
            {btn.text}
          </a>
        ) : (
          <span
            key={btn._key}
            className="inline-block rounded-full px-4 py-2 text-sm font-medium text-foreground border border-border"
            style={value.buttonColour ? { backgroundColor: value.buttonColour } : undefined}
          >
            {btn.text}
          </span>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// hub — banner image with an optional link
// ---------------------------------------------------------------------------
function Hub({
  value,
}: {
  value: {
    title?: string;
    image?: { asset?: { _ref?: string }; alt?: string };
    link?: EdenLink;
  };
}) {
  const ref = value.image?.asset?._ref;
  if (!ref) return null;
  const src = sanityImageUrl({ _type: "reference", _ref: ref }, { width: 1200, fit: "max" });
  if (!src) return null;
  const href = edenHref(value.link);
  const img = (
    <figure className="my-8 rounded-xl overflow-hidden">
      <Image
        src={src}
        alt={value.image?.alt ?? value.title ?? ""}
        width={1200}
        height={400}
        className="w-full h-auto"
      />
    </figure>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:opacity-95 transition-opacity">
      {img}
    </a>
  ) : img;
}

// ---------------------------------------------------------------------------
// imageGridV2 — grid of linked images
// ---------------------------------------------------------------------------
type ImageGridItem = {
  _key: string;
  image?: { asset?: { _ref?: string }; alt?: string };
  link?: EdenLink;
  caption?: string;
};

function ImageGridV2({ value }: { value: { items?: ImageGridItem[]; columns?: number } }) {
  const items = value.items ?? [];
  if (items.length === 0) return null;
  const cols = value.columns ?? 3;
  return (
    <div
      className="my-8 grid gap-4"
      style={{ gridTemplateColumns: `repeat(${Math.min(cols, 4)}, minmax(0, 1fr))` }}
    >
      {items.map((item) => {
        const ref = item.image?.asset?._ref;
        if (!ref) return null;
        const src = sanityImageUrl({ _type: "reference", _ref: ref }, { width: 600, fit: "crop" });
        if (!src) return null;
        const href = edenHref(item.link);
        const img = (
          <figure key={item._key} className="rounded-lg overflow-hidden">
            <Image
              src={src}
              alt={item.image?.alt ?? item.caption ?? ""}
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
            {item.caption && (
              <figcaption className="text-xs text-muted-foreground mt-1 text-center">
                {item.caption}
              </figcaption>
            )}
          </figure>
        );
        return href ? (
          <a key={item._key} href={href} target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
            {img}
          </a>
        ) : img;
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// circleIconGrid — row of circular icon + label links
// ---------------------------------------------------------------------------
type CircleIconItem = {
  _key: string;
  label?: string;
  icon?: { asset?: { _ref?: string } };
  link?: EdenLink;
};

function CircleIconGrid({ value }: { value: { items?: CircleIconItem[] } }) {
  const items = value.items ?? [];
  if (items.length === 0) return null;
  return (
    <div className="my-8 flex flex-wrap gap-4 justify-center">
      {items.map((item) => {
        const ref = item.icon?.asset?._ref;
        const src = ref
          ? sanityImageUrl({ _type: "reference", _ref: ref }, { width: 120, fit: "crop" })
          : null;
        const href = edenHref(item.link);
        const inner = (
          <div className="flex flex-col items-center gap-2 w-20">
            <div className="w-16 h-16 rounded-full bg-muted overflow-hidden flex items-center justify-center border border-border">
              {src ? (
                <Image src={src} alt={item.label ?? ""} width={64} height={64} className="object-cover" />
              ) : (
                <span className="text-muted-foreground text-xs">?</span>
              )}
            </div>
            {item.label && (
              <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
            )}
          </div>
        );
        return href ? (
          <a key={item._key} href={href} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            {inner}
          </a>
        ) : (
          <div key={item._key}>{inner}</div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// slidePanel — simple image slideshow (rendered as scrollable strip)
// ---------------------------------------------------------------------------
type Slide = {
  _key: string;
  image?: { asset?: { _ref?: string }; alt?: string };
  link?: EdenLink;
};

function SlidePanel({ value }: { value: { slides?: Slide[]; title?: string } }) {
  const slides = value.slides ?? [];
  if (slides.length === 0) return null;
  return (
    <div className="my-8">
      {value.title && (
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          {value.title}
        </p>
      )}
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
        {slides.map((slide) => {
          const ref = slide.image?.asset?._ref;
          if (!ref) return null;
          const src = sanityImageUrl({ _type: "reference", _ref: ref }, { width: 800, height: 450, fit: "crop" });
          if (!src) return null;
          const href = edenHref(slide.link);
          const img = (
            <div key={slide._key} className="snap-start shrink-0 w-72 rounded-xl overflow-hidden">
              <Image
                src={src}
                alt={slide.image?.alt ?? ""}
                width={288}
                height={162}
                className="w-full h-auto"
              />
            </div>
          );
          return href ? (
            <a key={slide._key} href={href} target="_blank" rel="noopener noreferrer" className="snap-start shrink-0 hover:opacity-90 transition-opacity">
              <div className="w-72 rounded-xl overflow-hidden">
                <Image src={src} alt={slide.image?.alt ?? ""} width={288} height={162} className="w-full h-auto" />
              </div>
            </a>
          ) : img;
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// richText (nested) — a styled text panel with optional background colour
// ---------------------------------------------------------------------------
const nestedMarkComponents = {
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href?: string } }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="text-primary underline underline-offset-2 hover:opacity-80"
      >
        {children}
      </a>
    ),
    strong: ({ children }: { children: React.ReactNode }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: { children: React.ReactNode }) => <em className="italic">{children}</em>,
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NestedRichText({ value }: { value: { content?: any[]; backgroundColour?: string } }) {
  const blocks = value.content ?? [];
  if (blocks.length === 0) return null;
  return (
    <div
      className="my-6 rounded-xl p-6 border border-border"
      style={value.backgroundColour ? { backgroundColor: value.backgroundColour } : undefined}
    >
      <BasePortableText value={blocks} components={nestedMarkComponents} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// carouselV2 — product carousel using pre-fetched Algolia data
// ---------------------------------------------------------------------------
type CarouselV2Value = {
  _key?: string;
  heading?: string;
  title?: string;
  headingLink?: EdenLink;
  products?: {
    productIsbn?: string[];
    productIds?: number[];
  };
};

function CarouselV2({
  value,
  products,
}: {
  value: CarouselV2Value;
  products: AlgoliaProductHit[];
}) {
  const heading = value.heading ?? value.title ?? "Related products";
  const headingHref = edenHref(value.headingLink);
  const fallbackIsbns = value.products?.productIsbn ?? [];

  return (
    <aside className="my-10 -mx-4 sm:mx-0 not-prose">
      {/* Heading */}
      <div className="px-4 sm:px-0 mb-4">
        {headingHref ? (
          <a
            href={headingHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-bold text-foreground hover:text-primary transition-colors"
          >
            {heading}
          </a>
        ) : (
          <p className="text-base font-bold text-foreground">{heading}</p>
        )}
      </div>

      {/* Scrollable card rail */}
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-4 px-4 sm:px-0 snap-x snap-mandatory">
          {products.length > 0
            ? products.map((product) => (
                <div key={product.objectID} className="snap-start shrink-0">
                  <ProductCard product={product} />
                </div>
              ))
            : fallbackIsbns.map((isbn) => (
                <a
                  key={isbn}
                  href={`https://www.eden.co.uk/product/${isbn}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="snap-start shrink-0 flex items-center justify-center w-52 h-72 rounded-xl border border-border bg-card text-sm text-primary font-medium hover:bg-muted transition-colors"
                >
                  {isbn}
                </a>
              ))}
        </div>
        {(products.length > 3 || fallbackIsbns.length > 3) && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent" />
        )}
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Assembled component map (with optional carouselProductMap injected at render time)
// ---------------------------------------------------------------------------
function buildComponents(
  carouselProductMap?: Map<string, AlgoliaProductHit[]>,
): PortableTextComponents {
  return {
  types: {
    edenXtImage: ({ value }) => <EdenXtImage value={value} />,
    articleImage: ({ value }) => <ArticleImage value={value} />,
    edenXtVideo: ({ value }) => <EdenXtVideo value={value} />,
    video: ({ value }) => <SanityVideo value={value} />,
    featuredProduct: ({ value }) => <FeaturedProduct value={value} />,
    carouselV2: ({ value }) => (
      <CarouselV2
        value={value}
        products={carouselProductMap?.get(value._key) ?? []}
      />
    ),
    textHeadingV2: ({ value }) => <TextHeadingV2 value={value} />,
    buttonGrid: ({ value }) => <ButtonGrid value={value} />,
    hub: ({ value }) => <Hub value={value} />,
    imageGridV2: ({ value }) => <ImageGridV2 value={value} />,
    circleIconGrid: ({ value }) => <CircleIconGrid value={value} />,
    slidePanel: ({ value }) => <SlidePanel value={value} />,
    richText: ({ value }) => <NestedRichText value={value} />,
    // Suppress blocks that are purely commerce widgets or page-builder only
    featuredSectionCheckMarkCircledImage: () => null,
    testimonials: () => null,
    masonry: () => null,
    pageHeader: () => null,
    grid: () => null,
    productCarousel: () => null,
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
    em: ({ children }) => <em className="italic">{children}</em>,
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
  }; // end buildComponents return
} // end buildComponents

type EdenPortableTextProps = PortableTextProps & {
  carouselProductMap?: Map<string, AlgoliaProductHit[]>;
};

/** Portable text renderer with Eden-specific custom block components. */
export function PortableText({
  components,
  carouselProductMap,
  ...props
}: EdenPortableTextProps) {
  const builtComponents = buildComponents(carouselProductMap);
  return (
    <BasePortableText
      components={{ ...builtComponents, ...components }}
      {...props}
    />
  );
}
