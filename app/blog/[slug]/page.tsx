import { getArticleBySlug, getAllArticleSlugs } from "@lib/sanity/get-articles";
import { isSanityEnvConfigured } from "@lib/sanity/direct-fetch";
import { ArticleDetailPage } from "@components/blog/ArticleDetailPage";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  if (!isSanityEnvConfigured()) return [];
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

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

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  if (!isSanityEnvConfigured()) notFound();

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return <ArticleDetailPage article={article} />;
}
