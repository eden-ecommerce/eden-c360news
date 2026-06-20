import { type Article } from "@lib/sanity/get-articles";
import { ArticleCard } from "@components/blog/ArticleCard";

type ArticleGridProps = {
  articles: Article[];
};

export function ArticleGrid({ articles }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground text-sm">
          No stories found in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border">
      {articles.map((article) => (
        <div key={article.id} className="bg-background">
          <ArticleCard article={article} />
        </div>
      ))}
    </div>
  );
}
