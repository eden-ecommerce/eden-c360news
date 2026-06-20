"use client";

import { Suspense, lazy } from "react";

// Lazy-import the async RSC so the client PortableText can render it inside Suspense
const ProductCarousel = lazy(() =>
  import("@components/blog/ProductCarousel").then((m) => ({
    default: m.ProductCarousel,
  })),
);

type EdenLink = { linkType?: string; linkValue?: string };

type Props = {
  value: {
    heading?: string;
    title?: string;
    headingLink?: EdenLink;
    products?: {
      pickerType?: string;
      productIsbn?: string[];
      productIds?: number[];
    };
    showSticker?: boolean;
  };
};

function CarouselSkeleton({ heading }: { heading?: string }) {
  return (
    <aside className="my-10">
      {heading && (
        <p className="text-base font-bold text-foreground mb-4">{heading}</p>
      )}
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 w-52 h-80 rounded-xl bg-muted animate-pulse"
          />
        ))}
      </div>
    </aside>
  );
}

export function ProductCarouselLoader({ value }: Props) {
  const heading = value.heading ?? value.title;
  return (
    <Suspense fallback={<CarouselSkeleton heading={heading} />}>
      <ProductCarousel value={value} />
    </Suspense>
  );
}
