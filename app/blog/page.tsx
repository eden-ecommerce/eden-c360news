export const dynamic = "force-dynamic";

import { getArticles } from "@lib/sanity/get-articles";
import { getArticleTags } from "@lib/sanity/get-categories";
import { BlogListingPage } from "@components/blog/BlogListingPage";
import { isSanityEnvConfigured } from "@lib/sanity/direct-fetch";
import { IntegrationEnvError } from "@components/common/IntegrationEnvError";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Read Christian articles, devotionals and news from Eden.co.uk — encouraging and equipping Christians across the UK.",
};

export default async function BlogPage() {
  if (!isSanityEnvConfigured()) {
    return <IntegrationEnvError integration="sanity" />;
  }

  const [articles, tags] = await Promise.all([
    getArticles(),
    getArticleTags(),
  ]);

  return <BlogListingPage articles={articles} tags={tags} />;
}
