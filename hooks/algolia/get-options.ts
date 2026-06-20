import { queryOptions } from "@tanstack/react-query";
import { fetchAlgoliaSearch } from "@hooks/algolia/fetch-algolia-search";
import { algoliaKeys } from "@hooks/algolia/get-key";

type Options = {
  query: string;
  indices?: readonly string[];
  enabled?: boolean;
};

export function getAlgoliaSearchQueryOptions({
  query,
  indices,
  enabled = true,
}: Options) {
  const indexList = indices ? [...indices] : [];

  return queryOptions({
    queryKey: algoliaKeys.search(query, indexList),
    queryFn: () => fetchAlgoliaSearch({ query, indices }),
    enabled: enabled && query.length >= 2,
    staleTime: 30_000,
  });
}
