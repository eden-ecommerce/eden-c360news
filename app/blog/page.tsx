import { getArticles } from "@lib/sanity/get-articles";
import { getArticleCategories } from "@lib/sanity/get-categories";
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

  const [articles, categories] = await Promise.all([
    getArticles(),
    getArticleCategories(),
  ]);

  return <BlogListingPage articles={articles} categories={categories} />;
}
