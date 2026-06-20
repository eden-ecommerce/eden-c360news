/**
 * React Query key factory for Algolia client search.
 * Hierarchical keys — invalidate with `queryKey: algoliaKeys.all` or narrower scopes.
 */
export const algoliaKeys = {
  all: ["algolia"] as const,
  searches: () => [...algoliaKeys.all, "search"] as const,
  search: (query: string, indices: string[]) =>
    [...algoliaKeys.searches(), query, ...indices] as const,
};
