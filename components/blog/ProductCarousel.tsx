import {
  fetchProductsByIsbn,
  fetchProductsByIds,
} from "@lib/algolia/fetch-products-by-isbn";
import { ProductCard } from "@components/blog/ProductCard";

type EdenLink = {
  linkType?: string;
  linkValue?: string;
};

type CarouselProducts = {
  pickerType?: string;
  productIsbn?: string[];
  productIds?: number[];
};

type Props = {
  value: {
    heading?: string;
    title?: string;
    headingLink?: EdenLink;
    products?: CarouselProducts;
    showSticker?: boolean;
  };
};

export async function ProductCarousel({ value }: Props) {
  const isbns = value.products?.productIsbn ?? [];
  const productIds = value.products?.productIds ?? [];
  const heading = value.heading ?? value.title ?? "Related products";
  const headingHref = value.headingLink?.linkValue;

  // Fetch — prefer ISBNs (more reliable), fall back to numeric IDs
  const products =
    isbns.length > 0
      ? await fetchProductsByIsbn(isbns)
      : await fetchProductsByIds(productIds);

  // If Algolia isn't configured or returned nothing, render ISBN links as fallback
  const fallbackIsbns = isbns.length > 0 ? isbns : [];
  const hasFallback = products.length === 0 && fallbackIsbns.length > 0;

  return (
    <aside className="my-10 -mx-4 sm:mx-0">
      {/* Heading */}
      <div className="px-4 sm:px-0 mb-4">
        {headingHref ? (
          <a
            href={headingHref.startsWith("http") ? headingHref : `https://www.eden.co.uk${headingHref}`}
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
        <div className="flex gap-3 overflow-x-auto pb-4 px-4 sm:px-0 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {products.length > 0
            ? products.map((product) => (
                <div key={product.objectID} className="snap-start shrink-0">
                  <ProductCard product={product} />
                </div>
              ))
            : hasFallback
            ? fallbackIsbns.map((isbn) => (
                <a
                  key={isbn}
                  href={`https://www.eden.co.uk/product/${isbn}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="snap-start shrink-0 flex items-center justify-center w-52 h-72 rounded-xl border border-border bg-card text-sm text-primary font-medium hover:bg-muted transition-colors"
                >
                  {isbn}
                </a>
              ))
            : null}
        </div>

        {/* Fade hint on right to indicate scrollability */}
        {(products.length > 3 || fallbackIsbns.length > 3) && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent" />
        )}
      </div>
    </aside>
  );
}
