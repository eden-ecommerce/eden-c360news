import { getArticleBySlug } from "@lib/sanity/get-articles";
import { isSanityEnvConfigured } from "@lib/sanity/direct-fetch";
import { ArticleDetailPage } from "@components/blog/ArticleDetailPage";
import {
  fetchProductsByIds,
  fetchProductsByIsbn,
  type AlgoliaProductHit,
} from "@lib/algolia/fetch-products-by-isbn";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// With 2,800+ articles, static generation is impractical — use dynamic rendering.
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
    },
  };
}

/** Extract all carouselV2 blocks from richText and pre-fetch their products server-side. */
async function prefetchCarouselProducts(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  richText: any[] | null,
): Promise<Map<string, AlgoliaProductHit[]>> {
  const productMap = new Map<string, AlgoliaProductHit[]>();
  if (!richText) return productMap;

  const carousels = richText.filter((b) => b._type === "carouselV2");
  await Promise.all(
    carousels.map(async (block) => {
      const isbns: string[] = block.products?.productIsbn ?? [];
      const ids: number[] = block.products?.productIds ?? [];
      const products =
        isbns.length > 0
          ? await fetchProductsByIsbn(isbns)
          : await fetchProductsByIds(ids);
      productMap.set(block._key, products);
    }),
  );
  return productMap;
}

export default async function ChristianNewsArticlePage({ params }: Props) {
  const { slug } = await params;

  if (!isSanityEnvConfigured()) notFound();

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const carouselProductMap = await prefetchCarouselProducts(article.richText);

  return (
    <ArticleDetailPage article={article} carouselProductMap={carouselProductMap} />
  );
}
