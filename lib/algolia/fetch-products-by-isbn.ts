/**
 * Server-side helper to fetch product data from Algolia by product ID list.
 * Used by the blog carousel to render real product cards.
 *
 * Field names confirmed from live index:
 *   product_id, product_name, author, format, price, rrp, image, url,
 *   stock, inStock, manuf_ref (ISBN), stickerLeft, stickerRight,
 *   stockLevelText, stockLevelTextV2Short, shortDeliveryString
 */

export type AlgoliaProductHit = {
  objectID: string;
  product_id?: string | number;
  product_name?: string;
  subtitle?: string;
  author?: string;
  format?: string;
  price?: number;
  rrp?: number;
  saving_percent?: number;
  image?: string;
  imageFallback?: string;
  url?: string;
  stock?: number;
  inStock?: number;
  manuf_ref?: string; // ISBN-13
  stickerLeft?: string;
  stickerRight?: string;
  stockLevelText?: string;
  stockLevelTextV2Short?: string;
  shortDeliveryString?: string;
  availability?: string;
};

const ATTRIBUTES = [
  "objectID",
  "product_id",
  "product_name",
  "subtitle",
  "author",
  "format",
  "price",
  "rrp",
  "saving_percent",
  "image",
  "imageFallback",
  "url",
  "stock",
  "inStock",
  "manuf_ref",
  "stickerLeft",
  "stickerRight",
  "stockLevelText",
  "stockLevelTextV2Short",
  "shortDeliveryString",
];

async function algoliaQuery(
  filters: string,
  limit: number,
): Promise<AlgoliaProductHit[]> {
  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? process.env.ALGOLIA_APPLICATION_ID;
  const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ?? process.env.ALGOLIA_API_KEY;

  if (!appId || !apiKey) return [];

  try {
    const res = await fetch(
      `https://${appId}-dsn.algolia.net/1/indexes/products/query`,
      {
        method: "POST",
        headers: {
          "X-Algolia-API-Key": apiKey,
          "X-Algolia-Application-Id": appId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: "",
          filters,
          hitsPerPage: limit,
          attributesToRetrieve: ATTRIBUTES,
        }),
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.hits ?? [];
  } catch {
    return [];
  }
}

/** Fetch products by Sanity productIds (numeric). Preserves original order. */
export async function fetchProductsByIds(
  productIds: number[],
): Promise<AlgoliaProductHit[]> {
  if (productIds.length === 0) return [];
  const filters = productIds.map((id) => `product_id:${id}`).join(" OR ");
  const hits = await algoliaQuery(filters, productIds.length);

  // Re-order to match the Sanity-defined order
  const hitMap = new Map(
    hits.map((h) => [String(h.product_id), h]),
  );
  return productIds
    .map((id) => hitMap.get(String(id)))
    .filter((h): h is AlgoliaProductHit => Boolean(h));
}

/** Fetch products by ISBN-13 (stored as manuf_ref). Preserves original order. */
export async function fetchProductsByIsbn(
  isbns: string[],
): Promise<AlgoliaProductHit[]> {
  if (isbns.length === 0) return [];
  const filters = isbns.map((isbn) => `manuf_ref:${isbn}`).join(" OR ");
  const hits = await algoliaQuery(filters, isbns.length);

  const hitMap = new Map(hits.map((h) => [h.manuf_ref ?? "", h]));
  return isbns
    .map((isbn) => hitMap.get(isbn))
    .filter((h): h is AlgoliaProductHit => Boolean(h));
}
