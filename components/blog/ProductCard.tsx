import type { AlgoliaProductHit } from "@lib/algolia/fetch-products-by-isbn";
import Image from "next/image";
import Link from "next/link";

type Props = {
  product: AlgoliaProductHit;
};

export function ProductCard({ product }: Props) {
  const href =
    product.url ??
    `https://www.eden.co.uk/product/${product.manuf_ref ?? product.product_id}/`;

  const inStock = Boolean(product.inStock);
  const sticker = product.stickerLeft ?? product.stickerRight ?? null;
  const deliveryMsg = product.shortDeliveryString ?? null;
  const stockText = product.stockLevelTextV2Short ?? product.stockLevelText ?? null;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col w-52 shrink-0 rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Book cover */}
      <div className="relative w-full aspect-[2/3] bg-muted overflow-hidden">
        {sticker && (
          <span className="absolute top-2 left-0 z-10 flex items-center gap-1 bg-[#f4f9f4] border border-[#c8e6c9] text-[#004c0e] text-[11px] font-medium px-2 py-0.5 rounded-r-full">
            <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="none" aria-hidden>
              <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
              <path d="M4 6h4M6 4v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {sticker}
          </span>
        )}
        {product.image ? (
          <Image
            src={product.image}
            alt={product.product_name ?? "Book cover"}
            fill
            sizes="208px"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            No image
          </div>
        )}
      </div>

      {/* Dispatch badge */}
      {deliveryMsg && (
        <div className="bg-[#e8f5e9] text-[#1b5e20] text-[11px] font-medium text-center py-1 px-2 leading-tight">
          {deliveryMsg}
        </div>
      )}

      {/* Details */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <span className="block text-sm font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {product.product_name ?? "Untitled"}
        </span>
        {product.author && (
          <span className="block text-xs text-muted-foreground">by {product.author}</span>
        )}
        {(product.format || stockText) && (
          <span className="block text-xs text-muted-foreground">
            {[product.format, stockText].filter(Boolean).join(" | ")}
          </span>
        )}
        {typeof product.price === "number" && (
          <span className="block text-sm font-bold text-foreground mt-auto pt-1">
            £{product.price.toFixed(2)}{" "}
            {inStock && (
              <span className="text-xs font-normal text-muted-foreground">
                | Today&apos;s Price
              </span>
            )}
          </span>
        )}
      </div>

      {/* CTA */}
      <div className="px-3 pb-3">
        <div className="w-full rounded-lg bg-[#0077cc] group-hover:bg-[#005fa3] text-white text-sm font-semibold text-center py-2 transition-colors">
          Add to basket
        </div>
      </div>
    </Link>
  );
}
