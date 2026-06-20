export const dynamic = "force-dynamic";

import { getArticles } from "@lib/sanity/get-articles";
import { BlogListingPage } from "@components/blog/BlogListingPage";
import { isSanityEnvConfigured } from "@lib/sanity/direct-fetch";
import { IntegrationEnvError } from "@components/common/IntegrationEnvError";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Christian News",
  description:
    "The latest Christian news, articles and stories from Eden.co.uk — encouraging and equipping Christians across the UK.",
};

export default async function ChristianNewsPage() {
  if (!isSanityEnvConfigured()) {
    return <IntegrationEnvError integration="sanity" />;
  }

  const articles = await getArticles();

  return <BlogListingPage articles={articles} />;
}
