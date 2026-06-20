export const dynamic = "force-dynamic";

import { getArticles, getArticlesByTag } from "@lib/sanity/get-articles";
import { getArticleTags } from "@lib/sanity/get-categories";
import { BlogListingPage } from "@components/blog/BlogListingPage";
import { isSanityEnvConfigured } from "@lib/sanity/direct-fetch";
import { IntegrationEnvError } from "@components/common/IntegrationEnvError";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Christian News",
  description:
    "The latest Christian news, articles and stories from Eden.co.uk — encouraging and equipping Christians across the UK.",
};

type Props = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function ChristianNewsPage({ searchParams }: Props) {
  if (!isSanityEnvConfigured()) {
    return <IntegrationEnvError integration="sanity" />;
  }

  const { tag } = await searchParams;
  const activeTag = tag ?? null;

  const [articles, tags] = await Promise.all([
    activeTag ? getArticlesByTag(activeTag) : getArticles(),
    getArticleTags(),
  ]);

  return <BlogListingPage articles={articles} tags={tags} activeTag={activeTag} />;
}
